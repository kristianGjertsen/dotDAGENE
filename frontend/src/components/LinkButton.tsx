import type { ReactNode } from 'react';
import { colorMap, type color } from '../lib/colors';

interface ButtonProps {
  children: ReactNode;
  link: string;
  color: color;
  onClick?: () => void;
  className?: string;
}

export const LinkButton = ({
  children,
  link,
  color,
  onClick,
  className = '',
}: ButtonProps) => {
  var textColorClass = "";
  if (color === 'white' || color === 'yellow') {
    textColorClass = 'text-black'
  }
  else {
    textColorClass = 'text-white';
  }
  return (
    <a
      href={link}
      onClick={onClick}
      className={`group relative inline-block cursor-pointer select-none focus:outline-none whitespace-nowrap ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 bg-black" />
      <span
        className={
          `relative block border-3 border-black px-6 py-3 text-center text-2xl font-medium ${textColorClass} transition-transform duration-150 ` +
          'group-hover:translate-x-1 group-hover:translate-y-1' +
          colorMap.get(color)
        }
      >
        <span className="pointer-events-none">{children}</span>
      </span>
    </a>
  );
};
