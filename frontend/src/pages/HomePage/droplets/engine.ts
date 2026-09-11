import * as THREE from 'three';
import { fragmentShader, vertexShader } from './shaders.js';
import { styles } from './styles.js';
import type { DropletHeroProps } from './index.js';

type Options = Required<Omit<DropletHeroProps, 'className' | 'style' | 'scrollTarget'>> & { scrollTarget?: string };

// No module-level browser access or shared state: safe to import during SSR,
// mount more than once, and remount under React StrictMode.
export function mountDroplets(host: HTMLElement, options: Options): () => void {
    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    const section = document.createElement('section');
    section.style.height = `${options.scrollHeight}svh`;
    section.setAttribute('aria-label', options.title);
    const stage = document.createElement('div');
    stage.className = 'stage';
    stage.style.backgroundColor = options.backgroundColor;
    stage.style.color = options.textColor;
    const titleOffset = 0.08;
    stage.style.setProperty('--title-offset', `${titleOffset * 100}svh`);
    const title = document.createElement('p');
    title.className = 'title';
    const titleText = document.createElement('span');
    const titleParts = options.title === 'dotDAGENE'
        ? [{ text: 'dot', weight: '400' }, { text: 'DAGENE', weight: '700' }]
        : [{ text: options.title, weight: '700' }];
    const titleRuns = titleParts.map(({ text, weight }) => {
        const run = document.createElement('span');
        run.textContent = text;
        run.style.fontWeight = weight;
        titleText.append(run);
        return run;
    });
    title.append(titleText);
    title.style.fontFamily = options.fontFamily;
    title.style.color = options.textColor;
    title.style.webkitTextStrokeColor = options.outlineColor;
    stage.append(title);
    const details = document.createElement('div');
    details.className = 'details';
    details.style.fontFamily = options.fontFamily;
    const subtitle = document.createElement('p');
    subtitle.className = 'subtitle';
    subtitle.textContent = 'Nyeste karrieredagene på NTNU';
    const date = document.createElement('p');
    date.className = 'date';
    date.textContent = '9 og 10. februar';
    details.append(subtitle, date);
    stage.append(details);
    section.append(stage);
    root.replaceChildren(style, section);
    const events = new AbortController();
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    if (options.scrollTarget) {
        const link = document.createElement('a');
        link.className = 'scroll';
        link.textContent = 'Scroll for å utforske ↓';
        link.href = `#${options.scrollTarget.replace(/^#/, '')}`;
        link.addEventListener('click', (event) => {
            const target = document.getElementById(options.scrollTarget!.replace(/^#/, ''));
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
            }
        }, { signal: events.signal });
        stage.append(link);
    }

    let renderer: THREE.WebGLRenderer;
    let overlay: THREE.WebGLRenderer;
    try {
        renderer = new THREE.WebGLRenderer();
        try { overlay = new THREE.WebGLRenderer({ alpha: true }); }
        catch (error) { renderer.dispose(); renderer.forceContextLoss(); throw error; }
    } catch {
        // Preserve the title and normal page scrolling when WebGL is unavailable.
        return () => { events.abort(); root.replaceChildren(); };
    }
    renderer.setClearColor(0x000000, 1);
    overlay.setClearColor(0x000000, 0);
    renderer.domElement.className = 'glass';
    overlay.domElement.className = 'hover';
    const titleCanvas = document.createElement('canvas');
    const outlineCanvas = document.createElement('canvas');
    for (const canvas of [titleCanvas, renderer.domElement, overlay.domElement]) {
        canvas.setAttribute('aria-hidden', 'true');
        stage.append(canvas);
    }

    const rgb = (value: string) => new THREE.Color(value).convertLinearToSRGB();
    const mask = document.createElement('canvas');
    let texture = new THREE.CanvasTexture(mask);
    let outlineTexture = new THREE.CanvasTexture(outlineCanvas);
    const trail = Array.from({ length: 15 }, () => new THREE.Vector2());
    const uniforms = {
        uTime: { value: 0 }, uScroll: { value: 0 }, uIntroTime: { value: 0 },
        uColorSpeed: { value: options.colorSpeed }, uIntroDuration: { value: options.introDuration },
        uBlobColor: { value: rgb(options.blobColor) }, uBackgroundColor: { value: rgb(options.backgroundColor) },
        uTextOverlay: { value: false }, uTextMask: { value: texture },
        uTextHoverColor: { value: rgb(options.hoverTextColor) },
        uOutlineMask: { value: outlineTexture },
        uOutlineColor: { value: rgb(options.outlineColor) },
        uOutlineHoverColor: { value: rgb(options.outlineHoverColor) },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uTitleOffset: { value: titleOffset },
        uPointerTrail: { value: trail }, uShowStaticBlob: { value: true },
    };
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.RawShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const textMaterial = new THREE.RawShaderMaterial({
        vertexShader, fragmentShader, transparent: true, depthTest: false,
        uniforms: { ...uniforms, uTextOverlay: { value: true } },
    });
    const scene = new THREE.Scene();
    const textScene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(new THREE.Mesh(geometry, material));
    textScene.add(new THREE.Mesh(geometry, textMaterial));

    let disposed = false;
    let width = 1;
    let height = 1;
    const resize = () => {
        if (disposed) return;
        width = Math.max(1, stage.clientWidth);
        height = Math.max(1, stage.clientHeight);
        renderer.setSize(width, height);
        overlay.setSize(width, height);
        uniforms.uResolution.value.set(width, height);
        const maskSizeChanged = mask.width !== width || mask.height !== height;
        mask.width = width;
        mask.height = height;
        if (maskSizeChanged) {
            // GPU texture storage cannot change dimensions after its first upload.
            // Both materials share this uniform, so replace the texture together.
            texture.dispose();
            texture = new THREE.CanvasTexture(mask);
            uniforms.uTextMask.value = texture;
            outlineTexture.dispose();
            outlineTexture = new THREE.CanvasTexture(outlineCanvas);
            uniforms.uOutlineMask.value = outlineTexture;
        }
        titleCanvas.width = width;
        titleCanvas.height = height;
        outlineCanvas.width = width;
        outlineCanvas.height = height;
        const context = mask.getContext('2d');
        const titleContext = titleCanvas.getContext('2d');
        const outlineContext = outlineCanvas.getContext('2d');
        if (!context || !titleContext || !outlineContext) return;
        const parent = stage.getBoundingClientRect();
        // Measure each font weight in the DOM and use the same positioned
        // glyphs for the visible title, hover mask and both outline colors.
        for (const run of titleRuns) {
            const computed = getComputedStyle(run);
            const range = document.createRange();
            range.selectNodeContents(run);
            const bounds = range.getBoundingClientRect();
            const text = run.textContent ?? '';
            context.resetTransform();
            context.font = `${computed.fontStyle} ${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
            context.letterSpacing = computed.letterSpacing;
            const metrics = context.measureText(text);
            const ascent = metrics.fontBoundingBoxAscent;
            const descent = metrics.fontBoundingBoxDescent;
            context.translate(bounds.left - parent.left,
                bounds.top - parent.top + (bounds.height - ascent - descent) / 2 + ascent);
            context.scale(bounds.width / Math.max(metrics.width, 1), 1);
            context.fillStyle = '#fff';
            context.fillText(text, 0, 0);

            outlineContext.setTransform(context.getTransform());
            outlineContext.font = context.font;
            outlineContext.letterSpacing = context.letterSpacing;
            const strokeWidth = parseFloat(computed.webkitTextStrokeWidth) || 0;
            if (strokeWidth > 0) {
                outlineContext.lineWidth = strokeWidth;
                outlineContext.strokeStyle = computed.webkitTextStrokeColor;
                outlineContext.strokeText(text, 0, 0);
            }
        }
        // Cut out the complete fill after drawing all runs so adjoining
        // outlines cannot cover the neighboring letters' hover color.
        outlineContext.resetTransform();
        outlineContext.globalCompositeOperation = 'destination-out';
        outlineContext.drawImage(mask, 0, 0);
        // Color only the fill; the shader samples the mask's unchanged alpha.
        context.globalCompositeOperation = 'source-in';
        context.fillStyle = options.textColor;
        context.resetTransform();
        context.fillRect(0, 0, width, height);
        titleContext.drawImage(mask, 0, 0);
        title.style.opacity = '0';
        texture.needsUpdate = true;
        outlineTexture.needsUpdate = true;
    };

    const pointer = new THREE.Vector2();
    const target = new THREE.Vector2();
    const transitionFrom = new THREE.Vector2();
    let client: { x: number; y: number } | undefined;
    let tracking = false;
    let transitionStart: number | undefined;
    const stopTracking = () => {
        tracking = false;
        transitionStart = undefined;
        target.copy(pointer);
    };
    const setPointer = (x: number, y: number) => {
        if (!client) { transitionFrom.copy(pointer); transitionStart = performance.now(); }
        client = { x, y };
        tracking = true;
    };
    const pointerEvent = (event: PointerEvent) => {
        if (event.isPrimary) setPointer(event.clientX, event.clientY);
    };
    for (const type of ['pointermove', 'pointerenter', 'pointerdown'] as const) {
        stage.addEventListener(type, pointerEvent, { signal: events.signal });
    }
    for (const type of ['pointerleave', 'pointercancel'] as const) {
        stage.addEventListener(type, stopTracking, { signal: events.signal });
    }
    stage.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'touch') stopTracking();
    }, { signal: events.signal });
    stage.addEventListener('wheel', (event) => setPointer(event.clientX, event.clientY),
        { passive: true, signal: events.signal });
    window.addEventListener('blur', stopTracking, { signal: events.signal });
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    document.fonts.addEventListener('loadingdone', resize, { signal: events.signal });
    void document.fonts.ready.then(resize);
    resize();

    const startedAt = performance.now();
    let frame = 0;
    const render = (now: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(render);
        const sectionBounds = section.getBoundingClientRect();
        if (document.hidden || sectionBounds.bottom <= 0 || sectionBounds.top >= window.innerHeight) return;
        const bounds = stage.getBoundingClientRect();
        if (client && tracking) {
            if (client.x < bounds.left || client.x > bounds.right || client.y < bounds.top || client.y > bounds.bottom) {
                stopTracking();
            } else {
                target.set((client.x - bounds.left) / width * 2 - 1, 1 - (client.y - bounds.top) / height * 2);
            }
        }
        if (transitionStart !== undefined && !reducedMotion.matches) {
            const t = Math.min(1, (now - transitionStart) / 700);
            pointer.lerpVectors(transitionFrom, target, t * t * (3 - 2 * t));
            if (t === 1) transitionStart = undefined;
        } else { pointer.copy(target); }
        for (let i = trail.length - 1; i > 0; i--) trail[i].copy(trail[i - 1]);
        trail[0].copy(pointer);
        const elapsed = (now - startedAt) / 1000;
        uniforms.uTime.value = reducedMotion.matches ? 0 : elapsed * 2;
        uniforms.uIntroTime.value = reducedMotion.matches ? options.introDuration + 1 : elapsed;
        uniforms.uScroll.value = reducedMotion.matches ? 0
            : Math.max(0, Math.min(1, -sectionBounds.top / Math.max(1, section.offsetHeight - height)));
        renderer.render(scene, camera);
        overlay.render(textScene, camera);
    };
    frame = requestAnimationFrame(render);

    return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        events.abort();
        observer.disconnect();
        geometry.dispose();
        material.dispose();
        textMaterial.dispose();
        texture.dispose();
        outlineTexture.dispose();
        for (const instance of [renderer, overlay]) { instance.dispose(); instance.forceContextLoss(); }
        root.replaceChildren();
    };
}
