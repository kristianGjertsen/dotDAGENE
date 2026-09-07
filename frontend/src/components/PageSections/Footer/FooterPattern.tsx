import {
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

// Selected chaos layout. Edit the active values here.
const footerPatternSettings = {
  warpRadius: 120,
  warpMovement: 40,
  warpSoftness: 100,
  warpOpacity: 2,
  drawRadius: 170,
  drawOpacity: 0.4,
  drawBrightness: 0.66,
  // This pattern layer is still visible even though its pointer movement is zero.
  motionAOpacity: 0.34,
  motionAScale: 1.03,
};

// Function to randomly return a rotation class for the background image
const getRandomBackImageRotation = () => {
  return Math.random() < 0.5 ? 'rotate-180' : '';
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

export const FooterPattern = ({ children }: { children: ReactNode }) => {
  const warpFilterId = useId();
  const warpMapRef = useRef<SVGFEImageElement>(null);
  const warpDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const warpFollowerRef = useRef({ x: 0.5, y: 0.5 });
  const warpLastPointerRef = useRef({ x: 0.5, y: 0.5 });
  const warpDragRef = useRef({ x: 0, y: 0 });
  const backImageRotation = useMemo(() => getRandomBackImageRotation(), []);
  const footerRef = useRef<HTMLElement>(null);
  const trailFrameRef = useRef<number | null>(null);
  const pointerTargetRef = useRef({ x: 0.5, y: 0.5 });
  const trailRef = useRef<
    {
      x: number;
      y: number;
      time: number;
      offsetX: number;
      offsetY: number;
      widthScale: number;
      fadeDuration: number;
      fadePower: number;
    }[]
  >([]);
  const pointerInsideRef = useRef(false);
  const updateTrailVariables = () => {
    const footer = footerRef.current;
    if (!footer || !pointerInsideRef.current) {
      trailFrameRef.current = null;
      return;
    }

    const target = pointerTargetRef.current;
    const trail = trailRef.current;
    // Displace the original pattern smoothly in the direction of travel.
    // Neutral channels outside the radius leave the rest of the pattern untouched.
    const settings = footerPatternSettings;
    const follower = warpFollowerRef.current;
    const width = footer.clientWidth;
    const height = footer.clientHeight;
    // Hold the last drag when stationary; only new movement changes it.
    const previous = warpLastPointerRef.current;
    if (target.x !== previous.x || target.y !== previous.y) {
      const dx = (target.x - follower.x) * width;
      const dy = (target.y - follower.y) * height;
      const divisor = Math.max(60, Math.hypot(dx, dy));
      warpDragRef.current = { x: dx / divisor, y: dy / divisor };
      follower.x += (target.x - follower.x) * 0.14;
      follower.y += (target.y - follower.y) * 0.14;
      warpLastPointerRef.current = { ...target };
    }
    const red = 50 - warpDragRef.current.x * 50;
    const green = 50 - warpDragRef.current.y * 50;
    const radius = Math.max(1, settings.warpRadius);
    const inner = Math.min(60, 100 - settings.warpSoftness);
    const map = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><radialGradient id="drag" gradientUnits="userSpaceOnUse" cx="${target.x * width}" cy="${target.y * height}" r="${radius}"><stop offset="${inner}%" stop-color="rgb(${red}%,${green}%,50%)"/><stop offset="100%" stop-color="rgb(50%,50%,50%)"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#drag)"/></svg>`;
    warpMapRef.current?.setAttribute(
      'href',
      `data:image/svg+xml,${encodeURIComponent(map)}`,
    );
    warpDisplacementRef.current?.setAttribute(
      'scale',
      `${2 * Math.min(settings.warpMovement, settings.warpRadius * 0.12) * settings.warpOpacity}`,
    );
    // Store the actual path; old sections fade in place instead of chasing the pointer.
    const now = performance.now();
    const lifetime = 700;
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
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const makeMask = (radius: number) => {
      const strokeWidth = Math.max(8, radius * 0.65);
      const points = trail.map((point) => ({
        ...point,
        x: point.x * width + point.offsetX * Math.min(radius * 0.35, 45),
        y: point.y * height + point.offsetY * Math.min(radius * 0.35, 45),
      }));
      const segments = reducedMotion
        ? ''
        : points
            .slice(1)
            .map((point, index) => {
              const previous = points[index];
              const before = points[Math.max(0, index - 1)];
              const after = points[Math.min(points.length - 1, index + 2)];
              // Each section dissolves at its own pace, with randomness fixed
              // at creation so the fade stays smooth over time.
              const remaining = Math.max(
                0,
                1 - (now - point.time) / point.fadeDuration,
              );
              const strength = Math.pow(remaining, point.fadePower);
              // Catmull–Rom control points keep the path smooth through turns.
              const c1x = previous.x + (point.x - before.x) / 6;
              const c1y = previous.y + (point.y - before.y) / 6;
              const c2x = point.x - (after.x - previous.x) / 6;
              const c2y = point.y - (after.y - previous.y) / 6;
              return `<path d="M ${previous.x} ${previous.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${point.x} ${point.y}" stroke="white" stroke-opacity="${strength}" stroke-width="${strokeWidth * (0.6 + remaining * 0.4) * point.widthScale}"/>`;
            })
            .join('');
      // Use the footer's coordinates, not the path's narrow bounding box:
      // vertical/horizontal trails otherwise clip the blur into straight edges.
      const filterPadding = Math.ceil(strokeWidth);
      const mask = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><filter id="soft" filterUnits="userSpaceOnUse" x="${-filterPadding}" y="${-filterPadding}" width="${width + filterPadding * 2}" height="${height + filterPadding * 2}"><feGaussianBlur stdDeviation="${Math.max(2, strokeWidth * 0.12)}"/></filter><radialGradient id="head"><stop stop-color="white"/><stop offset="0.4" stop-color="white" stop-opacity="0.85"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#soft)">${segments}</g><circle cx="${target.x * width}" cy="${target.y * height}" r="${radius}" fill="url(#head)"/></svg>`;
      return `url("data:image/svg+xml,${encodeURIComponent(mask)}")`;
    };
    footer.style.setProperty(
      '--footer-trail-mask',
      makeMask(settings.drawRadius),
    );

    trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
  };

  useEffect(() => {
    return () => {
      if (trailFrameRef.current !== null) {
        cancelAnimationFrame(trailFrameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    const x = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1,
    );
    const y = Math.min(
      Math.max((event.clientY - rect.top) / rect.height, 0),
      1,
    );

    if (!pointerInsideRef.current) {
      trailRef.current = [];
      warpFollowerRef.current = { x, y };
      warpLastPointerRef.current = { x, y };
      warpDragRef.current = { x: 0, y: 0 };
    }
    pointerTargetRef.current = { x, y };
    pointerInsideRef.current = true;

    if (trailFrameRef.current === null) {
      trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
    }
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;
    warpDragRef.current = { x: 0, y: 0 };
    warpDisplacementRef.current?.setAttribute('scale', '0');

    if (trailFrameRef.current !== null) {
      cancelAnimationFrame(trailFrameRef.current);
      trailFrameRef.current = null;
    }

    pointerTargetRef.current = { x: 0.5, y: 0.5 };
    trailRef.current = [];
    footerRef.current?.style.removeProperty('--footer-trail-mask');
  };

  const footerStyle = {
    '--footer-draw-opacity': footerPatternSettings.drawOpacity,
    '--footer-draw-brightness': footerPatternSettings.drawBrightness,
    '--footer-motion-a-opacity': footerPatternSettings.motionAOpacity,
    '--footer-motion-a-scale': footerPatternSettings.motionAScale,
  } as CSSProperties;

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
        style={footerStyle}
        className="footer-pattern bg-footer relative overflow-hidden border-t-2 border-black"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="footer-pattern__background"
          aria-hidden="true"
          style={{ filter: `url(#${warpFilterId})` }}
        >
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect--draw"
            rotationClass={backImageRotation}
          />
          <PatternLayer
            className="footer-pattern__layer footer-pattern__effect--motion-a"
            rotationClass={backImageRotation}
          />
        </div>
        {children}
      </footer>
    </div>
  );
};
