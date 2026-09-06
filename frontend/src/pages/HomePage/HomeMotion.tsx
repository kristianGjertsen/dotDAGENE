import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type RevealDirection = 'up' | 'left' | 'right';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
};

const hiddenTransform: Record<RevealDirection, string> = {
  up: 'translate-y-8',
  left: '-translate-x-8',
  right: 'translate-x-8',
};

export const Reveal = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: RevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    if (motionPreference.matches || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-[opacity,transform] duration-700 ease-out ${
        visible ? 'translate-x-0 translate-y-0 opacity-100' : `opacity-0 ${hiddenTransform[direction]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const ScrollJourney = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const activePath = activePathRef.current;
    if (!container || !activePath) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    let frame = 0;

    const update = () => {
      frame = 0;

      if (motionPreference.matches) {
        activePath.style.strokeDashoffset = '0';
        activePath.style.opacity = '0.45';
        return;
      }

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const startOffset = viewportHeight * 0.72;
      const travelDistance = Math.max(
        rect.height - viewportHeight * 0.35,
        viewportHeight,
      );
      const travelled = startOffset - rect.top;
      const progress = Math.min(Math.max(travelled / travelDistance, 0), 1);

      activePath.style.strokeDashoffset = `${1 - progress}`;
      activePath.style.opacity = `${0.35 + progress * 0.65}`;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    motionPreference.addEventListener('change', requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      motionPreference.removeEventListener('change', requestUpdate);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <svg
        className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full sm:block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M8 0 C8 8 92 7 92 18 S8 28 8 40 S92 50 92 62 S8 72 8 82 S92 92 92 100"
          fill="none"
          stroke="#677B4C"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.13"
        />
        <path
          ref={activePathRef}
          d="M8 0 C8 8 92 7 92 18 S8 28 8 40 S92 50 92 62 S8 72 8 82 S92 92 92 100"
          pathLength="1"
          fill="none"
          stroke="#677B4C"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          vectorEffect="non-scaling-stroke"
        />
        {[18, 40, 62, 82].map((y, index) => (
          <circle
            key={y}
            cx={index % 2 === 0 ? 92 : 8}
            cy={y}
            r="1.1"
            fill="#FFFBF1"
            stroke="#677B4C"
            strokeWidth="0.45"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="relative">{children}</div>
    </div>
  );
};
