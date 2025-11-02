export const Banner = () => {
  return (
    <section className="mt-20 mb-32 flex h-[150px] w-full items-center justify-center overflow-clip md:h-[300px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        viewBox="0 10 1000 180"
        preserveAspectRatio="xMidYMid slice"
      >
        <g>
          <path
            d="M0,30, L150,30 A30,30 0 0,1 180,60 A30,30 0 0,0 210,90 L330,90"
            stroke="#000000"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M550,90 L630,90 A20,20 0 0,1 630,130 L600,130"
            stroke="hsl(266deg 53% 70%)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M450,130 L400,130 A20,20 0 0,0 400,170 L510,170"
            stroke="hsl(87deg 23% 44%)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M700,170 L1000,170"
            stroke="hsl(45deg 80% 59%)"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          <text x="300" y="70" fontSize="32" fontWeight="bold" fill="#000000">
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
          <text x="460" y="135" fontSize="32" fontWeight="bold">
            <tspan fill="#000000">på </tspan>
            <tspan fill="hsl(87deg 23% 44%)">NTNU</tspan>
          </text>

          <text
            x="520"
            y="175"
            font-size="32"
            font-weight="bold"
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
