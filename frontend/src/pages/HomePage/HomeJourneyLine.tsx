import { useLayoutEffect, useRef } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type Point = { x: number; y: number };

const buildNaturalPath = (points: Point[]) => {
  if (points.length < 2) {
    return '';
  }

  // Cardinal/Catmull-Rom style interpolation gives us a continuous tangent
  // through every anchor. That avoids the sharp direction changes the old
  // midpoint curves could create while still letting the line weave across
  // the page in the same spirit as the hero graphic.
  const tension = 0.58;
  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? p2;

    const control1 = {
      x: p1.x + ((p2.x - p0.x) * tension) / 6,
      y: p1.y + ((p2.y - p0.y) * tension) / 6,
    };
    const control2 = {
      x: p2.x - ((p3.x - p1.x) * tension) / 6,
      y: p2.y - ((p3.y - p1.y) * tension) / 6,
    };

    d += ` C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${p2.x} ${p2.y}`;
  }

  return d;
};

export const HomeJourneyLine = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const linePath = linePathRef.current;
    const container = root?.parentElement;

    if (!root || !svg || !linePath || !container) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const anchors = Array.from(
      container.querySelectorAll<HTMLElement>('[data-journey-anchor]'),
    );

    let pathLength = 0;
    let frame = 0;

    const updateProgress = () => {
      frame = 0;

      if (pathLength <= 0) {
        return;
      }

      const rect = root.getBoundingClientRect();
      const startLine = window.innerHeight * 0.78;
      const endLine = window.innerHeight * 0.24;
      const distance = rect.height + startLine - endLine;
      const progress = reducedMotion.matches
        ? 1
        : clamp((startLine - rect.top) / Math.max(distance, 1), 0, 1);

      linePath.style.strokeDashoffset = `${pathLength * (1 - progress)}`;
    };

    const measure = () => {
      const rootRect = root.getBoundingClientRect();

      if (rootRect.width <= 0 || rootRect.height <= 0) {
        return;
      }

      svg.setAttribute('viewBox', `0 0 ${rootRect.width} ${rootRect.height}`);

      const measuredAnchors = anchors
        .map((anchor) => {
          const rect = anchor.getBoundingClientRect();
          const xRatio = clamp(
            Number.parseFloat(anchor.dataset.journeyX ?? '0.5'),
            -0.15,
            1.15,
          );
          const yRatio = clamp(
            Number.parseFloat(anchor.dataset.journeyY ?? '0.5'),
            0,
            1,
          );

          return {
            x: rect.left - rootRect.left + rect.width * xRatio,
            y: rect.top - rootRect.top + rect.height * yRatio,
          };
        })
        .filter(
          (point) =>
            point.y > -40 && point.y < rootRect.height + 40 && Number.isFinite(point.x),
        )
        .sort((a, b) => a.y - b.y);

      const points = [
        { x: rootRect.width + 32, y: 0 },
        ...measuredAnchors,
        { x: -32, y: rootRect.height },
      ];

      linePath.setAttribute('d', buildNaturalPath(points));
      pathLength = linePath.getTotalLength();
      linePath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      updateProgress();
    };

    const scheduleProgressUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    anchors.forEach((anchor) => resizeObserver.observe(anchor));

    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    reducedMotion.addEventListener('change', measure);

    measure();

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleProgressUpdate);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      reducedMotion.removeEventListener('change', measure);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden"
      aria-hidden="true"
    >
      <svg ref={svgRef} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path
          ref={linePathRef}
          fill="none"
          stroke="#677B4C"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};
