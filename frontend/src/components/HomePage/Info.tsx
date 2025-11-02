import type { ElementType, ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';

interface InfoProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  icon?: ElementType;
}

export const Info = ({
  titelChildren,
  children,
  color,
  icon: Icon,
}: InfoProps) => {
  return (
    <section
      className={
        colorMap.get(color) +
        ' flex w-full flex-col items-center justify-center gap-4 border-3 border-black p-6 text-white'
      }
    >
      {/* icon */}
      <section>{Icon && <Icon className="h-16 w-16" />}</section>
      <p className="text-2xl">{titelChildren}</p>
      <p>{children}</p>
    </section>
  );
};
