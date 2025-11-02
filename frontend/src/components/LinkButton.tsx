import type { ReactNode } from 'react';
import { colorMap, type color } from '../lib/colors';

interface ButtonProps {
  children: ReactNode;
  link: string;
  color: color;
}

export const LinkButton = ({ children, link, color }: ButtonProps) => {
  return (
    <a
      href={link}
      className="group relative inline-block cursor-pointer select-none focus:outline-none"
    >
      {/* Bottom "shadow" chip */}
      <span aria-hidden="true" className="absolute inset-0 bg-black" />
      {/* Top actual button chip */}
      <span
        className={
          'relative block border-3 border-black px-6 py-3 text-center text-2xl font-medium text-white transition-transform duration-150 ' +
          'group-hover:translate-x-1 group-hover:translate-y-1' +
          colorMap.get(color)
        }
      >
        <span className="pointer-events-none">{children}</span>
      </span>
    </a>
  );
};
