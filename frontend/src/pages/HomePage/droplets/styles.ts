// These rules are installed only inside the component's ShadowRoot.
export const styles = `
:host { display: block; }
* { box-sizing: border-box; }
section { all: initial; display: block; position: relative; }
.stage { all: initial; display: block; position: sticky; top: 0; height: 100svh;
    overflow: hidden; isolation: isolate; container-type: inline-size; }
.title { all: initial; display: flex; justify-content: center; align-items: center;
    height: 100%; margin: 0; font-size: 15cqw; font-weight: 700; font-stretch: 85%;
    letter-spacing: -0.06em; line-height: 1.15; white-space: nowrap;
    user-select: none; -webkit-text-stroke: 10px black; paint-order: stroke fill; }
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
