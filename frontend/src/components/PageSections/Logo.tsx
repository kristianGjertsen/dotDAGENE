import { useState } from "react";
import LogoImg from "../../assets/Logo_No_Text_No_Dot.svg";
import "./logoAnim.css";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div
      className={`relative block w-80 max-w-full min-w-[10rem] leading-none ${className}`}
      onMouseEnter={() => setIsAnimating(true)}
    >
      <img
        src={LogoImg}
        alt="Logo"
        className="block h-auto w-full"
        draggable={false}
      />

      <svg
        viewBox="0 200 852 110"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          className={`logo-dot ${isAnimating ? "logo-dot-animate" : ""}`}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          <path
            d="M149.829 303.145q-8.89.002-15.475-3.748-6.573-3.76-10.129-11.085-3.562-7.319-3.56-17.749-.002-10.426 3.56-17.765 3.555-7.352 10.129-11.117 6.585-3.763 15.475-3.763 8.889 0 15.46 3.763 6.585 3.765 10.145 11.117 3.558 7.339 3.559 17.765 0 10.43-3.559 17.749-3.56 7.325-10.145 11.085-6.571 3.75-15.46 3.748m0-8.31q9.39 0 14.379-5.927 4.986-5.926 4.986-18.345 0-12.477-4.986-18.392-4.988-5.928-14.379-5.927-9.408 0-14.425 5.958-5.003 5.944-5.002 18.361-.001 12.418 5.002 18.345 5.017 5.927 14.425 5.927"
            fill="#677b4c"
          />

          <path
            d="M150.291 245.29c-13.112 0-23.739 12.352-23.739 27.588 0 15.241 10.627 27.592 23.739 27.592s23.739-12.351 23.739-27.592c0-15.236-10.627-27.588-23.739-27.588"
            fill="#677b4c"
          />
        </g>
      </svg>
    </div>
  );
}
