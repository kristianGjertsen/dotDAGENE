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
import { createSvgImageLoader } from './svgImageLoader';

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

// Intrinsic viewBox ratio of backgroundInv.svg, used to match CSS background-size: cover.
const patternAspectRatio = 841.76 / 844.89;
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
// Draw the same gradient directly, without decoding an intermediate SVG image.
const createWarpMap = () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  return (target: Point, drag: Point, width: number, height: number) => {
    if (!context) return null;
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    const x = target.x * width;
    const y = target.y * height;
    const gradient = context.createRadialGradient(x, y, 0, x, y, warpRadius);
    gradient.addColorStop(
      warpInner / 100,
      `rgb(${50 - drag.x * 50}%, ${50 - drag.y * 50}%, 50%)`,
    );
    gradient.addColorStop(1, 'rgb(50%, 50%, 50%)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    return canvas.toDataURL('image/png');
  };
};

const makeTrailPaths = (
  trail: TrailPoint[],
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
    ? []
    : points.flatMap((point, pointIndex) => {
        if (pointIndex === 0) return [];
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
        if (remaining === 0) return [];
        const strength = Math.pow(remaining, sample.fadePower);
        // Catmull–Rom control points keep the path smooth through turns.
        const c1x = previous.x + (point.x - before.x) / 6;
        const c1y = previous.y + (point.y - before.y) / 6;
        const c2x = point.x - (after.x - previous.x) / 6;
        const c2y = point.y - (after.y - previous.y) / 6;
        return [
          {
            d: `M ${previous.x} ${previous.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}`,
            opacity: `${strength}`,
            width: `${strokeWidth * (0.6 + remaining * 0.4) * sample.widthScale}`,
          },
        ];
      });
  return segments;
};

const patternStyle = {
  '--footer-draw-opacity': footerPatternSettings.drawOpacity,
  '--footer-draw-brightness': footerPatternSettings.drawBrightness,
  '--footer-pattern-opacity': footerPatternSettings.patternOpacity,
  '--footer-pattern-scale': footerPatternSettings.patternScale,
} as CSSProperties;

export const FooterPattern = ({ children }: { children: ReactNode }) => {
  const warpFilterId = useId();
  const renderWarpRef = useRef<ReturnType<typeof createWarpMap> | null>(null);
  const warpMapRef = useRef<SVGFEImageElement>(null);
  const warpDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const trailSvgRef = useRef<SVGSVGElement>(null);
  const trailPathsRef = useRef<SVGGElement>(null);
  const trailHeadRef = useRef<SVGCircleElement>(null);
  const trailBlurRef = useRef<SVGFilterElement>(null);
  const trailImageRef = useRef<SVGGElement>(null);
  const patternImageRef = useRef<SVGImageElement>(null);
  const warpImageLoaderRef = useRef<ReturnType<
    typeof createSvgImageLoader
  > | null>(null);
  const trailMaskId = `${warpFilterId}-trail`;
  const trailBlurId = `${warpFilterId}-blur`;
  const trailHeadId = `${warpFilterId}-head`;
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
    sizeKey: '',
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
    const sizeKey = `${width},${height}`;
    if (sizeKey !== state.sizeKey) {
      trailSvgRef.current?.setAttribute('viewBox', `0 0 ${width} ${height}`);
      trailBlurRef.current?.setAttribute(
        'width',
        `${width + filterPadding * 2}`,
      );
      trailBlurRef.current?.setAttribute(
        'height',
        `${height + filterPadding * 2}`,
      );
      trailImageRef.current?.setAttribute(
        'transform',
        backImageRotation ? `rotate(180 ${width / 2} ${height / 2})` : '',
      );
      const imageWidth = Math.max(
        width * 1.1,
        height * 1.1 * patternAspectRatio,
      );
      const imageHeight = imageWidth / patternAspectRatio;
      patternImageRef.current?.setAttribute('x', `${(width - imageWidth) / 2}`);
      patternImageRef.current?.setAttribute(
        'y',
        `${(height - imageHeight) / 2}`,
      );
      patternImageRef.current?.setAttribute('width', `${imageWidth}`);
      patternImageRef.current?.setAttribute('height', `${imageHeight}`);
      state.sizeKey = sizeKey;
    }
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
      const map = renderWarpRef.current?.(target, state.drag, width, height);
      if (map) warpImageLoaderRef.current?.update(map);
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
    // is visible, leave the mask untouched until the pointer changes.
    if (fading || headKey !== state.headKey) {
      if (trailPathsRef.current) {
        const group = trailPathsRef.current;
        const segments = makeTrailPaths(
          trail,
          width,
          height,
          now,
          reducedMotion,
        );
        // Reuse SVG nodes instead of reparsing/replacing the whole trail each frame.
        segments.forEach((segment, index) => {
          let path = group.children[index];
          if (!path) {
            path = document.createElementNS(
              'http://www.w3.org/2000/svg',
              'path',
            );
            path.setAttribute('stroke', 'white');
            group.appendChild(path);
          }
          path.setAttribute('d', segment.d);
          path.setAttribute('stroke-opacity', segment.opacity);
          path.setAttribute('stroke-width', segment.width);
        });
        while (group.children.length > segments.length)
          group.lastElementChild?.remove();
      }
      trailHeadRef.current?.setAttribute('cx', `${target.x * width}`);
      trailHeadRef.current?.setAttribute('cy', `${target.y * height}`);
      trailSvgRef.current?.style.setProperty('visibility', 'visible');
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
    warpImageLoaderRef.current?.reset();
    trailSvgRef.current?.style.setProperty('visibility', 'hidden');
    if (trailPathsRef.current) trailPathsRef.current.innerHTML = '';
  }, []);

  useEffect(() => {
    renderWarpRef.current = createWarpMap();
    warpImageLoaderRef.current = createSvgImageLoader((url) => {
      warpMapRef.current?.setAttribute('href', url);
      warpMapRef.current?.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        url,
      );
      warpDisplacementRef.current?.setAttribute('scale', `${warpScale}`);
    });
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
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', pointerEvents: 'none' }}
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
          <div className="footer-pattern__layer footer-pattern__effect--draw">
            <div className="footer-pattern__draw-surface">
              <svg
                ref={trailSvgRef}
                width="100%"
                height="100%"
                style={{ visibility: 'hidden' }}
                aria-hidden="true"
              >
                <defs>
                  <filter
                    ref={trailBlurRef}
                    id={trailBlurId}
                    filterUnits="userSpaceOnUse"
                    x={-filterPadding}
                    y={-filterPadding}
                  >
                    <feGaussianBlur stdDeviation={trailBlur} />
                  </filter>
                  <radialGradient id={trailHeadId}>
                    <stop offset="0" stopColor="white" />
                    <stop offset="0.4" stopColor="white" stopOpacity="0.85" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                  <mask
                    id={trailMaskId}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    style={{ maskType: 'alpha' }}
                  >
                    <g
                      ref={trailPathsRef}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#${trailBlurId})`}
                    />
                    <circle
                      ref={trailHeadRef}
                      r={drawRadius}
                      fill={`url(#${trailHeadId})`}
                    />
                  </mask>
                </defs>
                <g mask={`url(#${trailMaskId})`}>
                  <g ref={trailImageRef}>
                    <image
                      ref={patternImageRef}
                      href={backtemp}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
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
