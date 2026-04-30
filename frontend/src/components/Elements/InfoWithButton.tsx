import type { ElementType, ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';
import backImgWhite from '../../assets/backgroundWhite.png';
import backImgGreen from '../../assets/backgroundGreen.png';

type BackImg = boolean | 'green' | 'white';

interface InfoWithButtonProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  backImg?: BackImg;
  textColor?: 'white' | 'black';
  icon?: ElementType;
  button: ReactNode;
  className?: string;
}
export const InfoWithButton = ({
  titelChildren,
  children,
  color,
  backImg = false,
  textColor = undefined,
  icon: Icon,
  button,
  className = '',
}: InfoWithButtonProps) => {
  const resolvedTextColor = textColor ?? (color === 'tertiary' || color === 'quaternary' || color === 'white' ? 'black' : 'white');
  const resolvedBackImg =
    backImg === true
      ? color === 'white'
        ? backImgWhite
        : backImgGreen
      : backImg === 'white'
        ? backImgWhite
        : backImg === 'green'
          ? backImgGreen
          : undefined;

  return (
    <section
      className={`${colorMap.get(color)} relative flex h-full flex-1 basis-0 min-w-0 flex-col items-center justify-center gap-4 border-2 border-black bg-cover bg-center p-6 pb-12 text-center text-${resolvedTextColor} ${className}`}
      style={
        resolvedBackImg
          ? { backgroundImage: `url(${resolvedBackImg})` }
          : undefined
      }
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
