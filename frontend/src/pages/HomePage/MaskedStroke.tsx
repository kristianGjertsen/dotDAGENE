import { useLayoutEffect, useRef } from 'react';

export type MaskedStrokeProps = {
  id: string;
  d: string;
  stroke: string;
  width?: number;
  dur: number;
  delay: number;
};

export function MaskedStroke({
  id,
  d,
  stroke,
  width = 7,
  dur,
  delay,
}: MaskedStrokeProps) {
  const maskPathRef = useRef<SVGPathElement>(null);
  const pulsePathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const path = maskPathRef.current;
    const pulse = pulsePathRef.current;
    if (!path || !pulse) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animations: Animation[] = [];
    let observer: IntersectionObserver | undefined;

    const reset = () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations = [];
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      pulse.style.opacity = '0';
    };

    const start = () => {
      reset();
      if (motionPreference.matches || typeof path.animate !== 'function') return;

      const length = path.getTotalLength();
      const pulseLength = Math.min(65, length * 0.25);
      path.style.strokeDasharray = `${length}`;
      pulse.style.strokeDasharray = `${pulseLength} ${length + pulseLength}`;

      animations = [
        path.animate(
          [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
          {
            duration: dur * 1000,
            delay: delay * 1000,
            easing: 'ease-out',
            fill: 'both',
          },
        ),
        // One gentle highlight travels along each existing curve, then settles.
        // A finite animation keeps the heading calm and avoids endless motion.
        pulse.animate(
          [
            { strokeDashoffset: pulseLength, opacity: 0, offset: 0 },
            { opacity: 0.8, offset: 0.12 },
            { opacity: 0.8, offset: 0.8 },
            { strokeDashoffset: -length, opacity: 0, offset: 1 },
          ],
          {
            duration: 2800,
            delay: (delay + dur + 0.15) * 1000,
            easing: 'ease-in-out',
            fill: 'both',
          },
        ),
      ];

      // Hidden responsive banners wait until they actually become visible.
      if (typeof IntersectionObserver !== 'undefined') {
        animations.forEach((animation) => animation.pause());
        observer = new IntersectionObserver(([entry]) => {
          animations.forEach((animation) => {
            if (entry.isIntersecting) animation.play();
            else animation.pause();
          });
        });
        observer.observe(path.ownerSVGElement ?? path);
      }
    };

    start();
    motionPreference.addEventListener('change', start);
    return () => {
      reset();
      motionPreference.removeEventListener('change', start);
    };
  }, [d, dur, delay]);

  return (
    <g aria-hidden="true" pointerEvents="none">
      <defs>
        <mask id={id}>
          <rect x="-2000" y="-2000" width="4000" height="4000" fill="black" />
          <path
            ref={maskPathRef}
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={width + 3}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pulsePathRef}
          d={d}
          fill="none"
          stroke="#C8D5AC"
          strokeWidth={width * 0.45}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0"
        />
      </g>
    </g>
  );
}
