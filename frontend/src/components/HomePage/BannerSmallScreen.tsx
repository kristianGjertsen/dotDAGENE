import { MaskedStroke } from "./MaskedStroke";

export const BannerSmall = () => {
  const LINE_ANIMATION_DELAY_SEC = 0.4;
  const d1 = 0.35,
    d2 = 0.25,
    d3 = 0.25,
    d4 = 0.35,
    gap = -0.08;

  const t2 = d1 + gap;
  const t3 = d1 + gap + d2 + gap;
  const t4 = d1 + gap + d2 + gap + d3 + gap;

  const stroke = 9;

  return (
    <section className="mt-15 mb-10 flex min-h-[200px] w-full items-center justify-center overflow-hidden">
      <div className="flex w-full justify-center">
        <svg
          //xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 200"
          preserveAspectRatio="xMidYMid slice"
          className="h-auto w-full min-w-[800px] max-w-none"
        >
          <g transform="translate(0,-6)">
            {/* svart topp-inn */}
            <MaskedStroke
              id="m-svart-sm"
              d="M0,10 H240 A17,17 0 0,1 257,27 V28 A17,17 0 0,0 274,45 H320"
              stroke="#000000"
              width={stroke}
              dur={d1}
              delay={LINE_ANIMATION_DELAY_SEC}
            />

            {/* lilla pil/løkke etter 'karrieredager' */}
            <MaskedStroke
              id="m-lilla-sm"
              d="M520,80 L565,80 A16,16 0 0,1 565,115 L484,115"
              stroke="hsl(266deg 53% 70%)"
              width={stroke}
              dur={d2}
              delay={LINE_ANIMATION_DELAY_SEC + t2}
            />

            {/* grønn løkke rundt 'NTNU' */}
            <MaskedStroke
              id="m-gronn-sm"
              d="M315,118 L230,118 A16,16 0 0,0 230,153 L295,153"
              stroke="hsl(87deg 23% 44%)"
              width={stroke}
              dur={d3}
              delay={LINE_ANIMATION_DELAY_SEC + t3}
            />

            {/* gul bunn-ut til høyre */}
            <MaskedStroke
              id="m-gul-sm"
              d="M505,153 H545 A17,17 0 0,1 562,170 V171 A17,17 0 0,0 579,188 H900"
              stroke="hsl(45deg 80% 59%)"
              width={stroke}
              dur={d4}
              delay={LINE_ANIMATION_DELAY_SEC + t4}
            />

            {/* tekst – sentrert */}
            <text
              x="400"
              y="52"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill="#000000"
            >
              Helt nye
            </text>

            <text
              x="400"
              y="90"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill="hsl(266deg 53% 70%)"
            >
              karrieredager
            </text>

            <text
              x="400"
              y="128"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
            >
              <tspan fill="#000000">på </tspan>
              <tspan fill="hsl(87deg 23% 44%)">NTNU</tspan>
            </text>

            <text
              x="400"
              y="166"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill="#000000"
            >
              <tspan>den </tspan>
              <tspan fill="hsl(45deg 80% 59%)">3. mars</tspan>
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
};
