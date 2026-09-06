import { type PointerEvent } from "react";

import "./KineticBanner.css";

type KineticBannerProps = {
  compact?: boolean;
};

const resetPointerOffset = (element: HTMLElement) => {
  element.style.setProperty("--pointer-x", "0px");
  element.style.setProperty("--pointer-y", "0px");
};

export const KineticBanner = ({ compact = false }: KineticBannerProps) => {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty("--pointer-x", `${x * 22}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 16}px`);
  };

  return (
    <section
      className={`kinetic-hero${compact ? " kinetic-hero--compact" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => resetPointerOffset(event.currentTarget)}
    >
      <div className="kinetic-hero__glow kinetic-hero__glow--one" aria-hidden="true" />
      <div className="kinetic-hero__glow kinetic-hero__glow--two" aria-hidden="true" />

      <div className="kinetic-hero__scene" aria-hidden="true">
        <div className="kinetic-ring kinetic-ring--outer">
          <span className="kinetic-ring__dot kinetic-ring__dot--large" />
        </div>
        <div className="kinetic-ring kinetic-ring--middle">
          <span className="kinetic-ring__dot" />
        </div>
        <div className="kinetic-ring kinetic-ring--inner">
          <span className="kinetic-ring__dot kinetic-ring__dot--small" />
        </div>

        <span className="kinetic-particle kinetic-particle--1" />
        <span className="kinetic-particle kinetic-particle--2" />
        <span className="kinetic-particle kinetic-particle--3" />
        <span className="kinetic-particle kinetic-particle--4" />
        <span className="kinetic-particle kinetic-particle--5" />
        <span className="kinetic-particle kinetic-particle--6" />
      </div>

      <div className="kinetic-date kinetic-date--left" aria-hidden="true">
        <span>09</span>
        <small>FEB</small>
      </div>
      <div className="kinetic-date kinetic-date--right" aria-hidden="true">
        <span>10</span>
        <small>FEB</small>
      </div>

      <div className="kinetic-hero__copy">
        <div className="kinetic-hero__eyebrow">
          <span className="kinetic-hero__eyebrow-dot" aria-hidden="true" />
          dotDAGENE 2027
        </div>
        <p className="kinetic-hero__lead">Nyeste karrieredagene på NTNU</p>
        <p className="kinetic-hero__title">
          Teknologi møter <span>talent.</span>
        </p>
        <p className="kinetic-hero__meta">9. og 10. februar</p>
      </div>
    </section>
  );
};
