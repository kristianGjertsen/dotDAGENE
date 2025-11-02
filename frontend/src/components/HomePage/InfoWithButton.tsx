import type { ElementType, ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';

interface InfoWithButtonProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  icon?: ElementType;
  button: ReactNode;
}
export const InfoWithButton = ({
  titelChildren,
  children,
  color,
  icon: Icon,
  button,
}: InfoWithButtonProps) => {
  return (
    <section
      className={
        colorMap.get(color) +
        ' w-full flex-col flex-wrap gap-4 border-3 border-black p-6 text-white'
      }
    >
      <section>{Icon && <Icon className="h-16 w-16" />}</section>
      <p className="text-2xl">{titelChildren}</p>
      <p>{children}</p>
      {button && <div>{button}</div>}
    </section>
  );
};
