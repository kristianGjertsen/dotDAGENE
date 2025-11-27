import type { ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';

interface ButtonProps {
  children: ReactNode;
  link: string;
  color: color;
  onClick?: () => void;
  className?: string;
  //Mulighet for å sette inn forskjellige størrelser med knapper
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const LinkButton = ({
  children,
  link,
  color,
  onClick,
  className = '',
  size = 'lg',
}: ButtonProps) => {
  var textColorClass = "";
  if (color === 'white' || color === 'yellow') {
    textColorClass = 'text-black'
  }
  else {
    textColorClass = 'text-white';
  }

  //Forskjellig størrelse knapper
  let sizeClasses = '';
  switch (size) {
    case 'xs':
      sizeClasses = 'px-3 py-1.5 text-base';
      break;
    case 'sm':
      sizeClasses = 'px-4 py-2 text-lg';
      break;
    case 'md':
      sizeClasses = 'px-5 py-2.5 text-xl';
      break;
    case 'xl':
      sizeClasses = 'px-8 py-4 text-3xl';
      break;
    //standard hvis ingen størrelse blir valgt
    default:
      sizeClasses = 'px-6 py-3 text-2xl';
      break;
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
          `relative block border-3 border-black ${sizeClasses} text-center font-medium ${textColorClass} transition-transform duration-150 ` +
          'group-hover:translate-x-1 group-hover:translate-y-1' +
          colorMap.get(color)
        }
      >
        <span className="pointer-events-none">{children}</span>
      </span>
    </a>
  );
};
