export const BannerSmall = () => {
  return (
    <section className="mt-15 mb-10 flex min-h-[200px] w-full items-center justify-center overflow-hidden">
      {/* midtstill så begge sider klippes jevnt når bredden blir smal */}
      <div className="w-full flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 200"
          preserveAspectRatio="xMidYMid slice"
          className="h-auto w-full min-w-[800px] max-w-none"
        >
          <g transform="translate(0,-6)">
            {/* svart topp-inn */}
            <path
              d="M0,10 H240 A17,17 0 0,1 257,27 V28 A17,17 0 0,0 274,45 H320"
              stroke="#000000"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* lilla pil/løkke etter 'karrieredager' */}
            <path
              d="M500,86 L600,86 A16,16 0 0,1 600,118 L570,118"
              stroke="hsl(266deg 53% 70%)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* grønn løkke rundt 'NTNU' */}
            <path
              d="M320,118 L270,118 A16,16 0 0,0 270,150 L380,150"
              stroke="hsl(87deg 23% 44%)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* gul bunn-ut til høyre */}
            <path
              d="M510,155 L620,160 A24,24 0 0,1 644,184 A24,24 0 0,0 668,192 L800,192"
              stroke="hsl(45deg 80% 59%)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
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
              <tspan fill="#000000">den </tspan>
              <tspan fill="hsl(45deg 80% 59%)">3. mars</tspan>
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
};
