// These rules are installed only inside the component's ShadowRoot.
export const styles = `
:host { display: block; }
* { box-sizing: border-box; }
section { all: initial; display: block; position: relative; }
.stage { all: initial; display: block; position: sticky; top: 0; height: 100svh;
    overflow: hidden; isolation: isolate; container-type: inline-size; }
.title { all: initial; display: flex; justify-content: center; align-items: center;
    height: 100%; margin: 0; font-size: 15cqw; font-weight: 700; font-stretch: 85%;
    letter-spacing: 0.0em; line-height: 1.15; white-space: nowrap;
    transform: translateY(calc(-1 * var(--title-offset)));
    user-select: none; -webkit-text-stroke: 10px black; paint-order: stroke fill; }
.details { position: absolute; top: calc(50% - var(--title-offset) + 9cqw);
    left: 0; width: 100%; padding: 1rem 1.5rem; z-index: 2;
    text-align: center; color: #000;
    -webkit-text-stroke: 3px #fff; paint-order: stroke fill; }
.subtitle { margin: 0; font-size: clamp(1.25rem, 3cqw, 3rem);
    font-weight: 700; line-height: 1.15; text-wrap: balance; }
.date { margin: 0.65rem 0 0; font-size: clamp(1rem, 2cqw, 2rem);
    font-weight: 500; line-height: 1.3; }
canvas { position: absolute; inset: 0; display: block; width: 100%; height: 100%; pointer-events: none; }
.glass { mix-blend-mode: difference; }
.hover { z-index: 1; }
.scroll { all: initial; position: absolute; bottom: 2rem; left: 50%;
    transform: translateX(-50%); z-index: 2; font: 700 0.85rem/1.4 sans-serif;
    color: inherit; cursor: pointer; white-space: nowrap; padding: 0.5rem; }
.scroll:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
@container (max-width: 700px) { .title { -webkit-text-stroke-width: 3px; } }
@media (prefers-reduced-motion: reduce) { section { height: 100svh !important; } }
`;
