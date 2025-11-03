export const BannerBig = () => {
  return (
    <section className="mt-15 flex  w-full items-center justify-center overflow-hidden md:min-h-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full min-w-[1000px] max-w-none"
        viewBox="0 10 1000 250"
        preserveAspectRatio="xMidYMid slice"
      >
        <g>
          {/* svart */}
          <path
            d="M0,30, L150,30 A30,30 0 0,1 180,60 A30,30 0 0,0 210,90 L330,90"
            stroke="#000000"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* lilla */}
          <path
            d="M550,90 L630,90 A20,20 0 0,1 630,130 L600,130"
            stroke="hsl(266deg 53% 70%)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* grønn */}
          <path
            d="M450,130 L400,130 A20,20 0 0,0 400,170 L510,170"
            stroke="hsl(87deg 23% 44%)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* gul */}
          <path
            d="M700,170 L850,170 A30,30 0 0,1 880,200 A30,30 0 0,0 910,230 L1030,230"
            stroke="hsl(45deg 80% 59%)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          <text x="290" y="65" fontSize="32" fontWeight="bold" fill="#000000">
            Helt nye
          </text>

          <text
            x="340"
            y="100"
            fontSize="32"
            fontWeight="bold"
            fill="hsl(266deg 53% 70%)"
          >
            karrieredager
          </text>

          <text x="455" y="140" fontSize="32" fontWeight="bold">
            <tspan fill="#000000">på </tspan>
            <tspan fill="hsl(87deg 23% 44%)">NTNU</tspan>
          </text>

          <text
            x="520"
            y="180"
            fontSize="32"
            fontWeight="bold"
            fill="#000000"
          >
            <tspan fill="#000000">den </tspan>
            <tspan fill="hsl(45deg 80% 59%)">3. mars</tspan>
          </text>
        </g>
      </svg>
    </section>
  );
};
