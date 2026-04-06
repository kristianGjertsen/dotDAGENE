import { MaskedStroke } from "../MaskedStroke";

export const BannerBig = () => {
  const LINE_ANIMATION_DELAY_SEC = 0.4;

  const d1 = 0.4,
    d2 = 0.3,
    d3 = 0.3,
    d4 = 0.4,
    gap = -0.1;

  const t2 = d1 + gap;
  const t3 = d1 + gap + d2 + gap;
  const t4 = d1 + gap + d2 + gap + d3 + gap;

  const stroke = 10;

  return (
    <section className="mt-15 flex w-full items-center justify-center overflow-hidden md:min-h-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full min-w-[1000px] max-w-none"
        viewBox="0 10 1000 250"
        preserveAspectRatio="xMidYMid slice"
      >
        <g>
          {/* linje 1: primary */}
          <MaskedStroke
            id="m-svart"
            d="M0,30 L150,30 A30,30 0 0,1 180,60 A30,30 0 0,0 210,90 L330,90"
            stroke="#677B4C"
            width={stroke}
            dur={d1}
            delay={LINE_ANIMATION_DELAY_SEC}
          />

          {/* linje 2: secondary */}
          <MaskedStroke
            id="m-lilla"
            d="M550,90 L630,90 A20,20 0 0,1 630,130 L600,130"
            stroke="#87A067"
            width={stroke}
            dur={d2}
            delay={LINE_ANIMATION_DELAY_SEC + t2}
          />

          {/* linje 3: tertiary */}
          <MaskedStroke
            id="m-gronn"
            d="M450,130 L400,130 A20,20 0 0,0 400,170 L510,170"
            stroke="#ABBC93"
            width={stroke}
            dur={d3}
            delay={LINE_ANIMATION_DELAY_SEC + t3}
          />

          {/* linje 4: quaternary */}
          <MaskedStroke
            id="m-gul"
            d="M700,170 L850,170 A30,30 0 0,1 880,200 A30,30 0 0,0 910,230 L1030,230"
            stroke="#D5DEC9"
            width={stroke}
            dur={d4}
            delay={LINE_ANIMATION_DELAY_SEC + t4}
          />
        </g>

        {/* Tekst */}
        <g>
          <text x="290" y="65" fontSize="32" fontWeight="bold" fill="black">
            Nyeste
          </text>

          <text
            x="340"
            y="100"
            fontSize="32"
            fontWeight="bold"
            fill="#677B4C"
          >
            karrieredagen
          </text>

          <text x="455" y="140" fontSize="32" fontWeight="bold">
            <tspan fill="#000">på </tspan>
            <tspan fill="#87A067">NTNU</tspan>
          </text>

          <text x="520" y="180" fontSize="32" fontWeight="bold" fill="#000">
            <tspan>den </tspan>
            <tspan fill="#ABBC93">3. mars</tspan>
          </text>
        </g>
      </svg>
    </section>
  );
};
