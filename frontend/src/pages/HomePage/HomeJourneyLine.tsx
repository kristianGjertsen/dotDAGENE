import { useLayoutEffect, useRef } from 'react';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const buildSmoothPath = (points: { x: number; y: number }[]) => {
  if (points.length < 2) {
    return '';
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middleY = previous.y + (current.y - previous.y) / 2;

    d += ` C ${previous.x} ${middleY}, ${current.x} ${middleY}, ${current.x} ${current.y}`;
  }

  return d;
};

export const HomeJourneyLine = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const haloPathRef = useRef<SVGPathElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    const haloPath = haloPathRef.current;
    const linePath = linePathRef.current;
    const container = root?.parentElement;

    if (!root || !svg || !haloPath || !linePath || !container) {
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
      const offset = pathLength * (1 - progress);

      haloPath.style.strokeDashoffset = `${offset}`;
      linePath.style.strokeDashoffset = `${offset}`;
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
            0,
            1,
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

      const sideInset = clamp(rootRect.width * 0.055, 24, 78);
      const points = [
        { x: rootRect.width - sideInset, y: 0 },
        ...measuredAnchors,
        { x: sideInset, y: rootRect.height },
      ];
      const d = buildSmoothPath(points);

      haloPath.setAttribute('d', d);
      linePath.setAttribute('d', d);

      pathLength = linePath.getTotalLength();
      const dash = `${pathLength} ${pathLength}`;

      haloPath.style.strokeDasharray = dash;
      linePath.style.strokeDasharray = dash;
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
      className="pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-screen -translate-x-1/2 overflow-hidden"
      aria-hidden="true"
    >
      <svg ref={svgRef} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path
          ref={haloPathRef}
          fill="none"
          stroke="#FFFBF1"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.94"
        />
        <path
          ref={linePathRef}
          fill="none"
          stroke="#677B4C"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};
