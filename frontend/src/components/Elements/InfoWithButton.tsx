import type { ElementType, ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';

interface InfoWithButtonProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  textColor?: 'white' | 'black';
  icon?: ElementType;
  button: ReactNode;
}
export const InfoWithButton = ({
  titelChildren,
  children,
  color,
  textColor = 'white',
  icon: Icon,
  button,
}: InfoWithButtonProps) => {
  return (
    <section
      className={`${colorMap.get(color)} relative w-full flex flex-col gap-4 border-3 border-black p-6 pb-12 text-${textColor}`}
    >
      <section>{Icon && <Icon className="h-16 w-16" />}</section>
      <p className="text-2xl">{titelChildren}</p>
      <p>{children}</p>
      {button && (
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
          {button}
        </div>
      )}
    </section>
  );
};
