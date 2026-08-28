type ToggleSliderOption<T extends string> = {
  value: T;
  label: string;
};

type ToggleSliderProps<T extends string> = {
  options: [ToggleSliderOption<T>, ToggleSliderOption<T>];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

const baseToggleButtonClasses =
  'relative z-10 flex-1 cursor-pointer px-6 py-2 text-base font-semibold transition-colors duration-300 sm:px-8 sm:py-2 sm:text-lg';

export function ToggleSlider<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: ToggleSliderProps<T>) {
  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div
      className="relative mt-4 inline-flex w-full max-w-md items-stretch overflow-hidden border-3 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.15)]"
      role="group"
      aria-label={ariaLabel}
    >
      <span
        aria-hidden="true"
        className={`bg-primary absolute inset-y-0 left-0 w-1/2 transition-transform duration-300 ${
          activeIndex === 1 ? 'translate-x-full' : ''
        }`}
      />
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`${index === 1 ? 'border-l-3 border-black' : ''} ${baseToggleButtonClasses} ${
            value === option.value
              ? 'text-white'
              : 'text-black hover:text-black/80'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
