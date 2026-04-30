import type { ElementType, ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';
import backImgGreen from '../../assets/backgroundGreen.png';
import backImgWhite from '../../assets/backgroundWhite.png';

type IconColor = color | 'black';
type BackImg = boolean | 'green' | 'white';

interface InfoProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  backImg?: BackImg;
  iconColor?: IconColor;
  icon?: ElementType;
}

const iconColorMap = new Map<IconColor, string>([
  ['primary', 'text-primary'],
  ['secondary', 'text-secondary'],
  ['tertiary', 'text-tertiary'],
  ['quaternary', 'text-quaternary'],
  ['white', 'text-white'],
  ['black', 'text-black'],
]);

export const Info = ({
  titelChildren,
  children,
  color,
  backImg = false,
  iconColor,
  icon: Icon,
}: InfoProps) => {
  const textColorClass = (color === 'tertiary' || color === 'quaternary' || color === 'white') ? 'text-black' : 'text-white';
  const iconColorClass = iconColor ? iconColorMap.get(iconColor) ?? '' : '';
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
      className={
        colorMap.get(color) +
        //må være mellomrom før flex-1 (ellers blir det feil css class)
        ` flex h-full flex-1 basis-0 min-w-0 flex-col items-center justify-center  gap-4 border-2 border-black bg-cover bg-center p-6 pb-12 ${textColorClass} text-center`}
      style={
        resolvedBackImg
          ? { backgroundImage: `url(${resolvedBackImg})` }
          : undefined
      }
    >
      {/* icon */}
      <section>
        {Icon && <Icon className={`h-16 w-16 ${iconColorClass}`} />}
      </section>
      <p className="text-2xl">{titelChildren}</p>
      <p>{children}</p>
    </section>
  );
};
