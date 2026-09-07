import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import backtemp from '../../../assets/backgroundInv.svg';
import './FooterPattern.css';

// Edit the appearance here. The static pattern remains visible behind the trail.
const footerPatternSettings = {
  warpRadius: 120,
  warpMovement: 40,
  warpSoftness: 100,
  warpOpacity: 2,
  drawRadius: 170,
  drawOpacity: 0.4,
  drawBrightness: 0.66,
  patternOpacity: 0.24,
  patternScale: 1.03,
};

type PatternLayerProps = {
  className: string;
  rotationClass: string;
};

const PatternLayer = ({ className, rotationClass }: PatternLayerProps) => (
  <div className={className} aria-hidden="true">
    <div
      className={`footer-pattern__image ${rotationClass}`}
      style={{ backgroundImage: `url(${backtemp})` }}
    />
  </div>
);

type Point = { x: number; y: number };
type TrailPoint = Point & {
  time: number;
  offsetX: number;
  offsetY: number;
  widthScale: number;
  fadeDuration: number;
  fadePower: number;
};

const { drawRadius } = footerPatternSettings;
const strokeWidth = Math.max(8, drawRadius * 0.65);
const filterPadding = Math.ceil(strokeWidth);
const trailOffset = Math.min(drawRadius * 0.35, 45);
const trailBlur = Math.max(2, strokeWidth * 0.12);
const warpRadius = Math.max(1, footerPatternSettings.warpRadius);
const warpInner = Math.min(60, 100 - footerPatternSettings.warpSoftness);
const warpScale =
  2 *
  Math.min(
    footerPatternSettings.warpMovement,
    footerPatternSettings.warpRadius * 0.12,
  ) *
  footerPatternSettings.warpOpacity;
// Keep this breakpoint in sync with FooterPattern.css.
const animationMediaQuery =
  '(min-width: 768px) and (hover: hover) and (pointer: fine)';
const lifetime = 700;
const svgUrl = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const makeWarpMap = (
  target: Point,
  drag: Point,
  width: number,
  height: number,
) => {
  const red = 50 - drag.x * 50;
  const green = 50 - drag.y * 50;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="drag" gradientUnits="userSpaceOnUse" cx="${target.x * width}" cy="${target.y * height}" r="${warpRadius}"><stop offset="${warpInner}%" stop-color="rgb(${red}%,${green}%,50%)"/><stop offset="100%" stop-color="rgb(50%,50%,50%)"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#drag)"/></svg>`;
};

const makeTrailMask = (
  trail: TrailPoint[],
  target: Point,
  width: number,
  height: number,
  now: number,
  reducedMotion: boolean,
) => {
  const points = trail.map((point) => ({
    x: point.x * width + point.offsetX * trailOffset,
    y: point.y * height + point.offsetY * trailOffset,
  }));
  const segments = reducedMotion
    ? ''
    : points
        .map((point, pointIndex) => {
          if (pointIndex === 0) return '';
          const index = pointIndex - 1;
          const sample = trail[pointIndex];
          const previous = points[index];
          const before = points[Math.max(0, index - 1)];
          const after = points[Math.min(points.length - 1, index + 2)];
          // Each section dissolves at its own pace, with randomness fixed
          // at creation so the fade stays smooth over time.
          const remaining = Math.max(
            0,
            1 - (now - sample.time) / sample.fadeDuration,
          );
          if (remaining === 0) return '';
          const strength = Math.pow(remaining, sample.fadePower);
          // Catmull–Rom control points keep the path smooth through turns.
          const c1x = previous.x + (point.x - before.x) / 6;
          const c1y = previous.y + (point.y - before.y) / 6;
          const c2x = point.x - (after.x - previous.x) / 6;
          const c2y = point.y - (after.y - previous.y) / 6;
          return `<path d="M ${previous.x} ${previous.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}" stroke="white" stroke-opacity="${strength}" stroke-width="${strokeWidth * (0.6 + remaining * 0.4) * sample.widthScale}"/>`;
        })
        .join('');
  // Use the footer's coordinates, not the path's narrow bounding box:
  // vertical/horizontal trails otherwise clip the blur into straight edges.
  const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="soft" filterUnits="userSpaceOnUse" x="${-filterPadding}" y="${-filterPadding}" width="${width + filterPadding * 2}" height="${height + filterPadding * 2}"><feGaussianBlur stdDeviation="${trailBlur}"/></filter><radialGradient id="head"><stop stop-color="white"/><stop offset="0.4" stop-color="white" stop-opacity="0.85"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft)">${segments}</g><circle cx="${target.x * width}" cy="${target.y * height}" r="${drawRadius}" fill="url(#head)"/></svg>`;
  return `url("${svgUrl(mask)}")`;
};

const patternStyle = {
  '--footer-draw-opacity': footerPatternSettings.drawOpacity,
  '--footer-draw-brightness': footerPatternSettings.drawBrightness,
  '--footer-pattern-opacity': footerPatternSettings.patternOpacity,
  '--footer-pattern-scale': footerPatternSettings.patternScale,
} as CSSProperties;

export const FooterPattern = ({ children }: { children: ReactNode }) => {
  const warpFilterId = useId();
  const warpMapRef = useRef<SVGFEImageElement>(null);
  const warpDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<MediaQueryList | null>(null);
  const animationMediaRef = useRef<MediaQueryList | null>(null);
  const backImageRotation = useMemo(
    () => (Math.random() < 0.5 ? 'rotate-180' : ''),
    [],
  );
  const animation = useRef({
    target: { x: 0.5, y: 0.5 },
    follower: { x: 0.5, y: 0.5 },
    previous: { x: 0.5, y: 0.5 },
    drag: { x: 0, y: 0 },
    trail: [] as TrailPoint[],
    inside: false,
    frame: null as number | null,
    warpKey: '',
    headKey: '',
  });

  const updateTrail = () => {
    const state = animation.current;
    const footer = footerRef.current;
    if (!footer || !state.inside) {
      state.frame = null;
      return;
    }
    const { target, trail, follower } = state;
    const width = footer.clientWidth;
    const height = footer.clientHeight;
    // Hold the last drag when stationary; only new movement changes it.
    const previous = state.previous;
    if (target.x !== previous.x || target.y !== previous.y) {
      const dx = (target.x - follower.x) * width;
      const dy = (target.y - follower.y) * height;
      const divisor = Math.max(60, Math.hypot(dx, dy));
      state.drag = { x: dx / divisor, y: dy / divisor };
      follower.x += (target.x - follower.x) * 0.14;
      follower.y += (target.y - follower.y) * 0.14;
      state.previous = { ...target };
    }

    // The warp map is unchanged during the fade; avoid decoding it again.
    const warpKey = `${target.x},${target.y},${width},${height}`;
    if (warpKey !== state.warpKey) {
      warpMapRef.current?.setAttribute(
        'href',
        svgUrl(makeWarpMap(target, state.drag, width, height)),
      );
      warpDisplacementRef.current?.setAttribute('scale', `${warpScale}`);
      state.warpKey = warpKey;
    }
    // Store the actual path; old sections fade in place instead of chasing the pointer.
    const now = performance.now();
    const last = trail[trail.length - 1];
    if (
      !last ||
      Math.hypot((target.x - last.x) * width, (target.y - last.y) * height) > 1
    ) {
      // Sample randomness once per point and blend it with the previous point
      // to get gentle wandering without flickering between animation frames.
      trail.push({
        ...target,
        time: now,
        fadeDuration: lifetime * (0.65 + Math.random() * 0.9),
        fadePower: 0.9 + Math.random() * 1.4,
        offsetX: (last?.offsetX ?? 0) * 0.8 + (Math.random() - 0.5) * 0.4,
        offsetY: (last?.offsetY ?? 0) * 0.8 + (Math.random() - 0.5) * 0.4,
        widthScale:
          (last?.widthScale ?? 1) * 0.8 + (0.7 + Math.random() * 0.6) * 0.2,
      });
    }
    while (
      trail.length &&
      (now - trail[0].time > lifetime * 1.55 || trail.length > 180)
    )
      trail.shift();

    const reducedMotion = mediaRef.current?.matches ?? false;
    const fading =
      !reducedMotion &&
      trail.some(
        (point, index) => index > 0 && now - point.time < point.fadeDuration,
      );
    const headKey = `${warpKey},${reducedMotion}`;
    // Keep the same sampling cadence and random sequence. Once only the head
    // is visible, skip SVG generation and browser repaints until it changes.
    if (fading || headKey !== state.headKey) {
      footer.style.setProperty(
        '--footer-trail-mask',
        makeTrailMask(trail, target, width, height, now, reducedMotion),
      );
      state.headKey = fading ? '' : headKey;
    }
    state.frame = requestAnimationFrame(updateTrail);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!animationMediaRef.current?.matches || event.pointerType !== 'mouse') {
      handlePointerLeave();
      return;
    }
    const footer = footerRef.current;
    if (!footer) return;
    const rect = footer.getBoundingClientRect();
    const target = {
      x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
      y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
    };
    const state = animation.current;
    if (!state.inside) {
      state.trail = [];
      state.follower = { ...target };
      state.previous = { ...target };
      state.drag = { x: 0, y: 0 };
    }
    state.target = target;
    state.inside = true;
    if (state.frame === null) state.frame = requestAnimationFrame(updateTrail);
  };

  const handlePointerLeave = useCallback(() => {
    const state = animation.current;
    state.inside = false;
    state.drag = { x: 0, y: 0 };
    state.target = { x: 0.5, y: 0.5 };
    state.trail = [];
    state.warpKey = '';
    state.headKey = '';
    if (state.frame !== null) cancelAnimationFrame(state.frame);
    state.frame = null;
    warpDisplacementRef.current?.setAttribute('scale', '0');
    footerRef.current?.style.removeProperty('--footer-trail-mask');
  }, []);

  useEffect(() => {
    mediaRef.current = window.matchMedia('(prefers-reduced-motion: reduce)');
    const media = window.matchMedia(animationMediaQuery);
    animationMediaRef.current = media;
    const handleMediaChange = () => {
      if (!media.matches) handlePointerLeave();
    };
    media.addEventListener('change', handleMediaChange);
    return () => {
      media.removeEventListener('change', handleMediaChange);
      handlePointerLeave();
    };
  }, [handlePointerLeave]);

  return (
    <div className="footer-pattern-shell">
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute' }}
      >
        <defs>
          <filter
            id={warpFilterId}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              ref={warpMapRef}
              result="drag-map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              ref={warpDisplacementRef}
              scale={0}
              in="SourceGraphic"
              in2="drag-map"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <footer
        ref={footerRef}
        style={patternStyle}
        className="footer-pattern bg-footer relative overflow-hidden border-t-2 border-black"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
      >
        <div
          className="footer-pattern__background"
          aria-hidden="true"
          style={
            { '--footer-warp-filter': `url(#${warpFilterId})` } as CSSProperties
          }
        >
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect--draw"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__static"
            rotationClass={backImageRotation}
          />
        </div>
        {children}
      </footer>
    </div>
  );
};
