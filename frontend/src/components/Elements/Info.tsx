import { useMemo, type ElementType, type ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';
import backgroundImage from '../../assets/backgroundInv.svg';

type BackImg = boolean | 'green' | 'white';

const backImgOpacity = {
  green: 0.07,
  white: 0.03,
} as const;

interface InfoProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  backImg?: BackImg;
  textColor?: 'white' | 'black';
  icon?: ElementType;
  className?: string;
}

export const Info = ({
  titelChildren,
  children,
  color,
  backImg = false,
  textColor = undefined,
  icon: Icon,
  className = '',
}: InfoProps) => {
  const isBackImgUpsideDown = useMemo(() => Math.random() < 0.5, []);

  const resolvedTextColor =
    textColor ??
    (color === 'tertiary' || color === 'quaternary' || color === 'white'
      ? 'black'
      : 'white');

  const resolvedTextColorClass =
    resolvedTextColor === 'black' ? 'text-black' : 'text-white';

  const resolvedBackImgVariant =
    backImg === true
      ? color === 'white'
        ? 'white'
        : 'green'
      : backImg || undefined;

  const resolvedBackImgOpacity = resolvedBackImgVariant
    ? backImgOpacity[resolvedBackImgVariant]
    : undefined;

  return (
    <section
      className={`${colorMap.get(color)} relative flex h-full flex-1 basis-0 min-w-0 flex-col items-center justify-center gap-4 border-2 border-black p-6 pb-12 text-center ${resolvedTextColorClass} ${className}`}
    >
      {resolvedBackImgOpacity && (
        <div
          className={`absolute inset-0 bg-cover bg-center ${
            isBackImgUpsideDown ? 'rotate-180' : ''
          }`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: resolvedBackImgOpacity,
          }}
          aria-hidden="true"
        />
      )}

      <section className="relative z-10">
        {Icon && <Icon className="h-16 w-16" />}
      </section>

      <p className="relative z-10 text-2xl">{titelChildren}</p>
      <p className="relative z-10">{children}</p>
    </section>
  );
};