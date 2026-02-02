import { useEffect, useRef, useState } from "react";
import { standMap, type StandId } from "./StandData";

type HoverState = {
    id: StandId;
    label: string;
    company: string;
    logo?: string;
    logoScale?: number;
};

function StandMap() {
    const ref = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<HoverState | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);
    const [tooltipMode, setTooltipMode] = useState<"desktop" | "mobile">("desktop");

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        (async () => {
            try {
                const svgUrl = new URL("./standkart_interactive.svg", import.meta.url).href;
                const res = await fetch(svgUrl);
                if (!res.ok) {
                    throw new Error(`Kunne ikke laste standkart (status ${res.status})`);
                }
                const svgText = await res.text();

                if (!ref.current) return;
                ref.current.innerHTML = svgText;

                const svg = ref.current.querySelector("svg");
                if (!svg) return;

                // Fjern default hover-farge definert i SVG-en (behold logikken, ikke fargen)
                const style = document.createElement("style");
                style.textContent = `
                    .hotspot:hover { fill: transparent !important; }
                    .hotspot:active { fill: transparent !important; }
                `;
                svg.appendChild(style);

                const hotspots = svg.querySelectorAll<SVGElement>(".hotspot");

                const listeners: Array<() => void> = [];

                const tooltipWidth = 260;
                const edgePadding = 12;
                const offsetY = 8;

                hotspots.forEach((el) => {
                    const id = el.id as StandId;
                    const data = standMap[id];

                    if (!data) return;

                    const onEnter = () => {
                        const containerRect = ref.current?.getBoundingClientRect();
                        const rect = el.getBoundingClientRect();
                        // Desktop: flytende tooltip. Mobil: fast boks under kartet.
                        const mobile = window.innerWidth < 768;

                        if (containerRect && !mobile) {
                            const rawLeft = rect.left - containerRect.left + rect.width / 2;
                            const half = tooltipWidth / 2;
                            const clampedLeft = Math.min(
                                Math.max(rawLeft, half + edgePadding),
                                containerRect.width - half - edgePadding,
                            );

                            const topRaw = rect.top - containerRect.top + rect.height / 2 + offsetY;
                            const maxTop = containerRect.height - edgePadding;
                            const clampedTop = Math.min(Math.max(edgePadding, topRaw), maxTop);

                            setTooltipPos({ left: clampedLeft, top: clampedTop });
                            setTooltipMode("desktop");
                        } else {
                            setTooltipPos(null);
                            setTooltipMode("mobile");
                        }

                        setHovered({
                            id,
                            label: data.label,
                            company: data.company,
                            logo: data.logo,
                            logoScale: data.logoScale,
                        });
                    };

                    const onLeave = () => setHovered(null);

                    const onClick = () => {
                        onEnter();
                    };

                    el.addEventListener("mouseenter", onEnter);
                    el.addEventListener("mouseleave", onLeave);
                    el.addEventListener("click", onClick);

                    listeners.push(() => {
                        el.removeEventListener("mouseenter", onEnter);
                        el.removeEventListener("mouseleave", onLeave);
                        el.removeEventListener("click", onClick);
                    });
                });

                cleanup = () => listeners.forEach((fn) => fn());
            } catch (err) {
                console.error(err);
                setError("Kunne ikke laste standkart akkurat nå.");
            }
        })();

        return () => cleanup?.();
    }, []);

    const logoSrc = hovered?.logo
        ? new URL(`../ParticipatingCompanies/Logos/${hovered.logo}`, import.meta.url).href
        : null;
    const logoScaleClamped = hovered?.logoScale
        ? Math.min(2, Math.max(0.9, hovered.logoScale))
        : 1;

    return (
        <div className="relative mb-20 max-w-4xl mx-auto">

            <h2 className="text-center text-4xl font-medium pb-8">
                Stands 3. mars 2026
            </h2>

            <div ref={ref} className="w-full [&_svg]:w-full [&_svg]:h-auto" />

            {error && (
                <div className="absolute top-4 left-4 bg-red-100 text-red-700 shadow px-3 py-2 text-sm">
                    {error}
                </div>
            )}

            {hovered && tooltipMode === "mobile" && (
                <div className="mt-6 w-full border-3 border-black bg-white px-5 py-4 text-sm shadow-[6px_6px_0px_#000]">
                    <div className="text-base font-semibold">Stand {hovered.label}</div>
                    <div className="text-slate-700">{hovered.company}</div>
                    {logoSrc ? (
                        <div className="mt-3 pl-5 flex items-center justify-start">
                            <img
                                src={logoSrc}
                                alt={hovered.company}
                                className="h-14 w-auto max-w-[240px] object-contain"
                                style={{ transform: `scale(${logoScaleClamped})` }}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="mt-2 text-xs text-gray-500">Logo ikke tilgjengelig</div>
                    )}
                </div>
            )}

            {hovered && tooltipMode === "desktop" && tooltipPos && (
                <div
                    className="absolute z-10 w-[320px] border-3 border-black bg-white px-5 py-4 text-sm shadow-[6px_6px_0px_#000]"
                    style={{
                        left: tooltipPos.left,
                        top: tooltipPos.top,
                        transform: "translate(-50%, -100%)",
                        pointerEvents: "none",
                    }}
                >
                    <div className="text-base font-semibold">Stand {hovered.label}</div>
                    <div className="text-slate-700">{hovered.company}</div>
                    {logoSrc ? (
                        <div className="mt-3 flex items-center justify-center">
                            <img
                                src={logoSrc}
                                alt={hovered.company}
                                className="h-14 w-auto max-w-[240px] object-contain"
                                style={{ transform: `scale(${logoScaleClamped})` }}
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="mt-2 text-xs text-gray-500">Logo ikke tilgjengelig</div>
                    )}
                </div>
            )}
        </div>
    );
}
export default StandMap;
