import { useLayoutEffect, useRef } from 'react';

const DESKTOP_PATH = [
  'M 1000 40',
  'C 910 40 910 150 820 150',
  'L 670 150',
  'C 560 150 560 290 450 290',
  'L 180 290',
  'C 70 290 70 440 180 440',
  'L 760 440',
  'C 900 440 900 620 760 620',
  'L 320 620',
  'C 180 620 180 800 320 800',
  'L 820 800',
  'C 940 800 940 980 820 980',
  'L 480 980',
  'C 340 980 340 1160 480 1160',
  'L 760 1160',
  'C 900 1160 900 1350 760 1350',
  'L 240 1350',
  'C 100 1350 100 1540 240 1540',
  'L 700 1540',
  'C 840 1540 840 1740 700 1740',
  'L 350 1740',
  'C 210 1740 210 1940 350 1940',
  'L 830 1940',
  'C 950 1940 950 2110 830 2110',
  'L 70 2110',
].join(' ');

const MOBILE_PATH = [
  'M 1000 30',
  'C 760 30 760 180 620 180',
  'L 190 180',
  'C 70 180 70 380 190 380',
  'L 760 380',
  'C 900 380 900 600 760 600',
  'L 230 600',
  'C 90 600 90 850 230 850',
  'L 790 850',
  'C 920 850 920 1100 790 1100',
  'L 180 1100',
  'C 70 1100 70 1380 180 1380',
  'L 760 1380',
  'C 900 1380 900 1660 760 1660',
  'L 250 1660',
  'C 110 1660 110 1920 250 1920',
  'L 860 1920',
  'C 960 1920 960 2110 860 2110',
  'L 90 2110',
].join(' ');

type JourneyPath = {
  path: SVGPathElement;
  head: SVGGElement;
  length: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const HomeJourneyLine = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const desktopHeadRef = useRef<SVGGElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const mobileHeadRef = useRef<SVGGElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const desktopPath = desktopPathRef.current;
    const desktopHead = desktopHeadRef.current;
    const mobilePath = mobilePathRef.current;
    const mobileHead = mobileHeadRef.current;

    if (!root || !desktopPath || !desktopHead || !mobilePath || !mobileHead) {
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let paths: JourneyPath[] = [];

    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const startAt = window.innerHeight * 0.82;
      const endAt = window.innerHeight * 0.18;
      const travelDistance = rect.height + startAt - endAt;
      const progress = reduceMotion.matches
        ? 1
        : clamp((startAt - rect.top) / Math.max(travelDistance, 1));

      for (const item of paths) {
        item.path.style.strokeDashoffset = `${item.length * (1 - progress)}`;

        if (reduceMotion.matches || progress < 0.005 || progress >= 0.999) {
          item.head.style.opacity = '0';
          continue;
        }

        const point = item.path.getPointAtLength(item.length * progress);
        item.head.setAttribute('transform', `translate(${point.x} ${point.y})`);
        item.head.style.opacity = '1';
      }
    };

    const measure = () => {
      paths = [
        {
          path: desktopPath,
          head: desktopHead,
          length: desktopPath.getTotalLength(),
        },
        {
          path: mobilePath,
          head: mobileHead,
          length: mobilePath.getTotalLength(),
        },
      ];

      for (const item of paths) {
        item.path.style.strokeDasharray = `${item.length}`;
      }

      update();
    };

    const scheduleUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', measure);
    reduceMotion.addEventListener('change', measure);
    measure();

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      resizeObserver.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', measure);
      reduceMotion.removeEventListener('change', measure);
    };
  }, []);

  const pathProps = {
    fill: 'none',
    stroke: '#677B4C',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-y-0 left-1/2 z-[5] w-screen -translate-x-1/2 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="hidden h-full w-full md:block"
        viewBox="0 0 1000 2150"
        preserveAspectRatio="none"
      >
        <path
          ref={desktopPathRef}
          d={DESKTOP_PATH}
          strokeWidth="8"
          opacity="0.94"
          {...pathProps}
        />
        <g ref={desktopHeadRef} className="transition-opacity duration-200">
          <circle r="13" fill="#FFFBF1" stroke="#677B4C" strokeWidth="4" />
          <circle r="4" fill="#677B4C" />
        </g>
      </svg>

      <svg
        className="h-full w-full md:hidden"
        viewBox="0 0 1000 2150"
        preserveAspectRatio="none"
      >
        <path
          ref={mobilePathRef}
          d={MOBILE_PATH}
          strokeWidth="6"
          opacity="0.9"
          {...pathProps}
        />
        <g ref={mobileHeadRef} className="transition-opacity duration-200">
          <circle r="15" fill="#FFFBF1" stroke="#677B4C" strokeWidth="5" />
          <circle r="5" fill="#677B4C" />
        </g>
      </svg>
    </div>
  );
};
