import { MaskedStroke } from "../MaskedStroke";

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
          viewBox="0 0 800 200"
          preserveAspectRatio="xMidYMid slice"
          className="h-auto w-full min-w-[800px] max-w-none"
        >
          <g transform="translate(0,-6)">
            {/* linje 1: primary */}
            <MaskedStroke
              id="m-svart-sm"
              d="M0,10 H240 A17,17 0 0,1 257,27 V28 A17,17 0 0,0 274,45 H320"
              stroke="#677B4C"
              width={stroke}
              dur={d1}
              delay={LINE_ANIMATION_DELAY_SEC}
            />

            {/* linje 2: secondary */}
            <MaskedStroke
              id="m-lilla-sm"
              d="M520,80 L555,80 A16,16 0 0,1 555,115 L484,115"
              stroke="#87A067"
              width={stroke}
              dur={d2}
              delay={LINE_ANIMATION_DELAY_SEC + t2}
            />

            {/* linje 3: tertiary */}
            <MaskedStroke
              id="m-gronn-sm"
              d="M315,118 L240,118 A16,16 0 0,0 240,153 L295,153"
              stroke="#ABBC93"
              width={stroke}
              dur={d3}
              delay={LINE_ANIMATION_DELAY_SEC + t3}
            />

            {/* linje 4: quaternary */}
            <MaskedStroke
              id="m-gul-sm"
              d="M505,153 H545 A17,17 0 0,1 562,170 V171 A17,17 0 0,0 579,188 H900"
              stroke="#D5DEC9"
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
              fill="black"
            >
              Nyeste
            </text>

            <text
              x="400"
              y="90"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
              fill="#677B4C"
            >
              karrieredagen
            </text>

            <text
              x="400"
              y="128"
              textAnchor="middle"
              fontSize="36"
              fontWeight="bold"
            >
              <tspan fill="#000000">på </tspan>
              <tspan fill="#87A067">NTNU</tspan>
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
              <tspan fill="#ABBC93">3. mars</tspan>
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
};
