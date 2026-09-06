import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export const Reveal = ({
  children,
  className = '',
  delay = 0,
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
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px',
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const ScrollJourney = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const progressLine = progressRef.current;
    const dot = dotRef.current;
    if (!container || !progressLine || !dot) return;

    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.7;
      const distance = Math.max(rect.height - viewportHeight * 0.35, 1);
      const progress = motionPreference.matches
        ? 1
        : Math.min(Math.max((start - rect.top) / distance, 0), 1);

      progressLine.style.transform = `scaleY(${progress})`;
      dot.style.top = `${progress * 100}%`;
      dot.style.opacity = progress > 0.01 ? '1' : '0';
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
    <div ref={containerRef} className="relative w-full">
      <div
        className="pointer-events-none absolute top-12 bottom-12 left-2 z-0 hidden w-4 lg:block"
        aria-hidden="true"
      >
        <div className="bg-primary/15 absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2" />
        <div
          ref={progressRef}
          className="bg-primary absolute top-0 bottom-0 left-1/2 w-1 origin-top -translate-x-1/2 scale-y-0 rounded-full"
        />
        <div
          ref={dotRef}
          className="bg-dotbackground border-primary absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-0 transition-opacity duration-200"
        />
      </div>

      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
