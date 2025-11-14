import React, { useLayoutEffect, useRef } from "react";

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

    useLayoutEffect(() => {
        const p = maskPathRef.current;
        if (!p) return;

        const L = p.getTotalLength();

        p.style.strokeDasharray = `${L}`;
        p.style.strokeDashoffset = `${L}`;

        p.getBoundingClientRect();

        p.animate(
            [
                { strokeDashoffset: L },
                { strokeDashoffset: 0 },
            ],
            {
                duration: dur * 1000,
                delay: delay * 1000,
                easing: "ease-out",
                fill: "forwards",
            }
        );
    }, [dur, delay]);

    return (
        <>
            <defs>
                <mask id={id}>
                    {/* svart = skjult */}
                    <rect
                        x="-2000"
                        y="-2000"
                        width="4000"
                        height="4000"
                        fill="black"
                    />
                    {/* hvit strek = viser linjen under */}
                    <path
                        ref={maskPathRef}
                        d={d}
                        fill="none"
                        stroke="white"
                        strokeWidth={width + 3}   // litt tykkere enn synlig linje
                        strokeLinecap="butt"
                        strokeLinejoin="round"
                    />
                </mask>
            </defs>

            {/* synlig linje */}
            <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={width}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                mask={`url(#${id})`}
            />
        </>
    );
}
