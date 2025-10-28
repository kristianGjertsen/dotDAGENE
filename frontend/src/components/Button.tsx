import type { ReactNode, MouseEvent } from 'react';

type color = 'purple' | 'green' | 'yellow';

interface ButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  color: color;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const colorMap = new Map<color, string>([
  ['green', ' bg-dotgreen'],
  ['purple', ' bg-dotpurple'],
  ['yellow', ' bg-dotyellow'],
]);

export const Button = ({
  children,
  onClick,
  color,
  type = 'button',
  disabled,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
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
    </button>
  );
};
