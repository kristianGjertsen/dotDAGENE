import { useMemo, type ElementType, type ReactNode } from 'react';
import { colorMap, type color } from '../../lib/colors';
import {
  backgroundPatternOpacity,
  type BackgroundPatternVariant,
} from '../../lib/backgroundPattern';
import backgroundImage from '../../assets/backgroundInv.svg';

type BackImg = boolean | BackgroundPatternVariant;

interface InfoWithButtonProps {
  titelChildren: string;
  children: ReactNode;
  color: color;
  backImg?: BackImg;
  textColor?: 'white' | 'black';
  icon?: ElementType;
  button?: ReactNode | null;
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
    ? backgroundPatternOpacity.infoCard[resolvedBackImgVariant]
    : undefined;

  return (
    <section
      className={`${colorMap.get(color)} relative flex h-full min-w-0 flex-1 basis-0 flex-col items-center justify-center gap-4 border-2 border-black p-6 pb-12 text-center ${resolvedTextColorClass} ${className}`}
    >
      {resolvedBackImgOpacity !== undefined && resolvedBackImgOpacity > 0 && (
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

      <h2 className="relative z-10 text-2xl font-medium">{titelChildren}</h2>
      <div className="relative z-10">{children}</div>

      {button && (
        <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 translate-y-1/2">
          {button}
        </div>
      )}
    </section>
  );
};
