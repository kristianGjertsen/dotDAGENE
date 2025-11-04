import { useLayoutEffect, useRef } from "react";

type MaskedStrokeProps = {
  id: string;
  d: string;
  stroke: string;
  width?: number; // synlig linje
  dur: number;    // sek
  delay: number;  // sek
};

function MaskedStroke({ id, d, stroke, width = 7, dur, delay }: MaskedStrokeProps) {
  const maskPathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const p = maskPathRef.current;
    if (!p) return;
    const L = p.getTotalLength();

    // Hvit mask-strek starter helt "borte"
    p.style.strokeDasharray = `${L}`;
    p.style.strokeDashoffset = `${L}`;
    // tving reflow før anim
    p.getBoundingClientRect();

    p.animate(
      [
        { strokeDashoffset: L },
        { strokeDashoffset: 0 }
      ],
      { duration: dur * 1000, delay: delay * 1000, easing: "ease-out", fill: "forwards" }
    );
  }, [dur, delay]);

  return (
    <>
      <defs>
        <mask id={id}>
          {/* svart bakgrunn = skjul alt */}
          <rect x="-2000" y="-2000" width="4000" height="4000" fill="black" />
          {/* hvit strek = vis det den dekker; BUTT for å unngå prikk/hale */}
          <path
            ref={maskPathRef}
            d={d}
            fill="none"
            stroke="white"
            strokeWidth={width + 3}   // litt tykkere enn synlig linje
            strokeLinecap="butt"      // ingen rund tupp i masken
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      {/* Synlig linje, rund cap, nøyaktig geometri */}
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

export const BannerBig = () => {
  const d1 = 0.35, d2 = 0.25, d3 = 0.25, d4 = 0.35, gap = -0.1;
  const t2 = d1 + gap;
  const t3 = d1 + gap + d2 + gap;
  const t4 = d1 + gap + d2 + gap + d3 + gap;

   const stroke = 9;

 return (
    <section className="mt-15 flex w-full items-center justify-center overflow-hidden md:min-h-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full min-w-[1000px] max-w-none"
        viewBox="0 10 1000 250"
        preserveAspectRatio="xMidYMid slice"
      >
        <g>
          <MaskedStroke
            id="m-svart"
            d="M0,30 L150,30 A30,30 0 0,1 180,60 A30,30 0 0,0 210,90 L330,90"
            stroke="#000"
            width={stroke}
            dur={d1}
            delay={0}
          />
          <MaskedStroke
            id="m-lilla"
            d="M550,90 L630,90 A20,20 0 0,1 630,130 L600,130"
            stroke="hsl(266deg 53% 70%)"
            width={stroke}        // 👈 og her
            dur={d2}
            delay={t2}
          />
          <MaskedStroke
            id="m-gronn"
            d="M450,130 L400,130 A20,20 0 0,0 400,170 L510,170"
            stroke="hsl(87deg 23% 44%)"
            width={stroke}
            dur={d3}
            delay={t3}
          />
          <MaskedStroke
            id="m-gul"
            d="M700,170 L850,170 A30,30 0 0,1 880,200 A30,30 0 0,0 910,230 L1030,230"
            stroke="hsl(45deg 80% 59%)"
            width={stroke}
            dur={d4}
            delay={t4}
          />
        </g>

        {/* tekst beholdes */}
        <g>
          <text x="290" y="65" fontSize="32" fontWeight="bold" fill="#000">
            Helt nye
          </text>
          <text x="340" y="100" fontSize="32" fontWeight="bold" fill="hsl(266deg 53% 70%)">
            karrieredager
          </text>
          <text x="455" y="140" fontSize="32" fontWeight="bold">
            <tspan fill="#000">på </tspan>
            <tspan fill="hsl(87deg 23% 44%)">NTNU</tspan>
          </text>
          <text x="520" y="180" fontSize="32" fontWeight="bold" fill="#000">
            <tspan>den </tspan>
            <tspan fill="hsl(45deg 80% 59%)">3. mars</tspan>
          </text>
        </g>
      </svg>
    </section>
  );
};