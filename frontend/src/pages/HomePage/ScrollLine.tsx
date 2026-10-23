import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { MaskedStrokeProps } from './MaskedStroke';

export type ScrollLineProps = Partial<
  Pick<MaskedStrokeProps, 'stroke' | 'width'>
> & {
  children: ReactNode;
  /** Radius på SVG-buene, i px. BannerBig bruker 20/30. */
  radius?: number;
  /** Avstand fra kortenes ytterkant til linjen langs sidene, i px. */
  gutter?: number;
  /** Hvilken side linjen kommer inn fra. */
  startSide?: 'left' | 'right';
  /** Hvor i skjermen tegnespissen følger scroll. Lavere verdi = senere. */
  scrollStart?: number;
  /** 1 gir én px fremdrift nedover innholdet per px scroll. */
  scrollSpeed?: number;
};

type Point = { x: number; y: number; revealAt: number };
type Stop = { length: number; revealAt: number };

// Kontinuerlig hastighet mellom scroll-intervallene, uten oversving eller
// tidsbasert etterslep: samme scroll-posisjon gir alltid samme tegnelengde.
function interpolateLength(stops: Stop[], index: number, progress: number) {
  const before = stops[index - 1];
  const after = stops[index];
  const span = after.revealAt - before.revealAt;
  const slope = (a: Stop, b: Stop) =>
    (b.length - a.length) / (b.revealAt - a.revealAt);
  const currentSlope = slope(before, after);
  const tangent = (a: number, b: number) =>
    a > 0 && b > 0 ? (2 * a * b) / (a + b) : 0;
  const startSlope =
    index > 1
      ? tangent(slope(stops[index - 2], before), currentSlope)
      : currentSlope;
  const endSlope =
    index < stops.length - 1
      ? tangent(currentSlope, slope(after, stops[index + 1]))
      : currentSlope;
  const t = progress;
  return (
    (2 * t ** 3 - 3 * t ** 2 + 1) * before.length +
    (t ** 3 - 2 * t ** 2 + t) * span * startSlope +
    (-2 * t ** 3 + 3 * t ** 2) * after.length +
    (t ** 3 - t ** 2) * span * endSlope
  );
}

// Rettlinjede strekk og ekte sirkelbuer (A), som i BannerBigScreen.
function roundedPath(points: Point[], radius: number) {
  let d = `M${points[0].x},${points[0].y}`;
  let length = 0;
  let previous = points[0];
  const stops: Stop[] = [{ length: 0, revealAt: points[0].revealAt }];

  for (let i = 1; i < points.length - 1; i++) {
    const before = points[i - 1];
    const corner = points[i];
    const after = points[i + 1];
    const incoming = Math.hypot(corner.x - before.x, corner.y - before.y);
    const outgoing = Math.hypot(after.x - corner.x, after.y - corner.y);
    const r = Math.max(0, Math.min(radius, incoming / 2, outgoing / 2));
    const dx = (corner.x - before.x) / incoming;
    const dy = (corner.y - before.y) / incoming;
    const nx = (after.x - corner.x) / outgoing;
    const ny = (after.y - corner.y) / outgoing;
    const entry = { x: corner.x - dx * r, y: corner.y - dy * r };
    const exit = { x: corner.x + nx * r, y: corner.y + ny * r };
    const sweep = dx * ny - dy * nx > 0 ? 1 : 0;

    d += ` L${entry.x},${entry.y}`;
    length += Math.hypot(entry.x - previous.x, entry.y - previous.y);
    stops.push({
      length: length + (Math.PI * r) / 4,
      revealAt: corner.revealAt,
    });
    if (r > 0) d += ` A${r},${r} 0 0,${sweep} ${exit.x},${exit.y}`;
    length += (Math.PI * r) / 2;
    previous = { ...exit, revealAt: corner.revealAt };
  }

  const end = points[points.length - 1];
  d += ` L${end.x},${end.y}`;
  length += Math.hypot(end.x - previous.x, end.y - previous.y);
  stops.push({ length, revealAt: end.revealAt });
  return { d, length, stops };
}

/**
 * Legg data-scroll-line-block på blokkene linjen skal gå bak.
 * Blokker på samme rad får én felles passering; stablede kort får hver sin.
 * Bruk tette bakgrunner på blokkene for å skjule linjen bak dem.
 */
export function ScrollLine({
  children,
  stroke = '#677B4C',
  width = 10,
  radius = 64,
  gutter = 72,
  startSide = 'right',
  scrollStart = 0.55,
  scrollSpeed = 1,
}: ScrollLineProps) {
  const maskId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    const line = lineRef.current;
    const mask = maskRef.current;
    if (!container || !svg || !line || !mask) return;

    let frame = 0;
    let needsMeasure = true;
    let pathLength = 0;
    let stops: Stop[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function measure() {
      if (!container || !svg || !line || !mask) return;
      const bounds = container.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const svgLeft = bounds.left + bounds.width / 2 - viewportWidth / 2;
      const blocks = Array.from(
        container.querySelectorAll<HTMLElement>('[data-scroll-line-block]'),
        (element) => element.getBoundingClientRect(),
      ).filter((rect) => rect.width > 0 && rect.height > 0);

      svg.style.width = `${viewportWidth}px`;
      svg.setAttribute('viewBox', `0 0 ${viewportWidth} ${bounds.height}`);
      if (!blocks.length || !bounds.height) {
        pathLength = 0;
        line.setAttribute('d', '');
        mask.setAttribute('d', '');
        return;
      }

      const rows: { top: number; bottom: number }[] = [];
      for (const block of blocks.sort((a, b) => a.top - b.top)) {
        const top = block.top - bounds.top;
        const bottom = block.bottom - bounds.top;
        const row = rows[rows.length - 1];
        if (row && top < row.bottom) {
          row.bottom = Math.max(row.bottom, bottom);
        } else {
          rows.push({ top, bottom });
        }
      }

      const edge = width / 2 + 2;
      const left = Math.max(
        edge,
        Math.min(...blocks.map((b) => b.left - svgLeft)) - gutter,
      );
      const right = Math.min(
        viewportWidth - edge,
        Math.max(...blocks.map((b) => b.right - svgLeft)) + gutter,
      );
      const overscan = Math.max(radius * 2, width * 2, 40);
      const startY = Math.max(edge, rows[0].top - 60);
      const endY = Math.min(
        bounds.height - edge,
        rows[rows.length - 1].bottom + 60,
      );
      const points: Point[] = [
        {
          x: startSide === 'left' ? -overscan : viewportWidth + overscan,
          y: startY,
          revealAt: 0,
        },
        { x: startSide === 'left' ? left : right, y: startY, revealAt: startY },
      ];

      rows.forEach((row, index) => {
        const y = (row.top + row.bottom) / 2;
        const fromLeft = (index % 2 === 0) === (startSide === 'left');
        points.push(
          { x: fromLeft ? left : right, y, revealAt: row.top },
          { x: fromLeft ? right : left, y, revealAt: row.bottom },
        );
      });

      const exitsRight = (rows.length % 2 === 1) === (startSide === 'left');
      points.push(
        { x: exitsRight ? right : left, y: endY, revealAt: endY - edge },
        {
          x: exitsRight ? viewportWidth + overscan : -overscan,
          y: endY,
          revealAt: endY,
        },
      );

      const path = roundedPath(points, radius);
      pathLength = path.length;
      stops = path.stops;
      line.setAttribute('d', path.d);
      mask.setAttribute('d', path.d);
      mask.style.strokeDasharray = `${pathLength} ${pathLength}`;
    }

    function draw() {
      frame = 0;
      if (needsMeasure) {
        measure();
        needsMeasure = false;
      }
      if (!container || !mask || !pathLength) return;

      // Bruk kortenes høyde som scroll-intervall for de horisontale strekkene.
      // Da tegnes hele passeringen gradvis, selv om selve strekket er vannrett.
      const revealAt =
        (window.innerHeight * scrollStart -
          container.getBoundingClientRect().top) *
        scrollSpeed;
      let drawn = 0;
      if (
        reducedMotion.matches ||
        revealAt >= stops[stops.length - 1].revealAt
      ) {
        drawn = pathLength;
      } else if (revealAt > stops[0].revealAt) {
        const nextIndex = stops.findIndex((stop) => stop.revealAt >= revealAt);
        const before = stops[nextIndex - 1];
        const after = stops[nextIndex];
        const progress =
          (revealAt - before.revealAt) / (after.revealAt - before.revealAt);
        drawn = interpolateLength(stops, nextIndex, progress);
      }
      mask.style.strokeDashoffset = `${pathLength - drawn}`;
    }

    function scheduleDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function scheduleMeasure() {
      needsMeasure = true;
      scheduleDraw();
    }

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(container);
    container
      .querySelectorAll('[data-scroll-line-block]')
      .forEach((block) => observer.observe(block));
    window.addEventListener('scroll', scheduleDraw, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    reducedMotion.addEventListener('change', scheduleDraw);
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleDraw);
      window.removeEventListener('resize', scheduleMeasure);
      reducedMotion.removeEventListener('change', scheduleDraw);
    };
  }, [gutter, radius, startSide, scrollSpeed, scrollStart, width, children]);

  return (
    <div ref={containerRef} className="relative isolate">
      <svg
        ref={svgRef}
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute top-0 left-1/2 z-0 h-full w-screen -translate-x-1/2 overflow-hidden"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <path
              ref={maskRef}
              fill="none"
              stroke="white"
              strokeWidth={width + 3}
              strokeLinecap="butt"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
        <path
          ref={lineRef}
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          mask={`url(#${maskId})`}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
