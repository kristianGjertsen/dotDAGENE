import { useEffect, useRef, useState } from 'react';
import { ToggleSlider } from '../../../components/Elements/ToggleSlider';
import { standDays, type StandDay, type StandId } from './StandData';

type HoverState = {
  id: StandId;
  label: string;
  company: string;
};

type StandMapProps = {
  title?: string;
  description?: string;
};

function StandMap({
  title = 'Stands 2027',
  description = 'Hover eller trykk på standene for å se hvem som står hvor.',
}: StandMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [activeDay, setActiveDay] = useState<StandDay>('february-9');
  const [error, setError] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [tooltipMode, setTooltipMode] = useState<'desktop' | 'mobile'>(
    'desktop',
  );

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const supportsHover = () =>
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    (async () => {
      try {
        const svgUrl = new URL('./standkart_interactive.svg', import.meta.url)
          .href;
        const res = await fetch(svgUrl);
        if (!res.ok) {
          throw new Error(`Kunne ikke laste standkart (status ${res.status})`);
        }
        const svgText = await res.text();

        if (!ref.current) return;
        ref.current.innerHTML = svgText;

        const svg = ref.current.querySelector('svg');
        if (!svg) return;

        const style = document.createElement('style');
        style.textContent = `
          .hotspot:hover { fill: transparent !important; }
          .hotspot:active { fill: transparent !important; }
        `;
        svg.appendChild(style);

        const hotspots = svg.querySelectorAll<SVGElement>('.hotspot');
        const listeners: Array<() => void> = [];

        const tooltipWidth = 260;
        const edgePadding = 12;
        const offsetY = 40;

        hotspots.forEach((el) => {
          const id = el.id as StandId;
          const data = standDays[activeDay].stands[id];

          if (!data) return;

          const onEnter = () => {
            const containerRect = ref.current?.getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            const touchMode = !supportsHover();

            if (containerRect && !touchMode) {
              const rawLeft = rect.left - containerRect.left + rect.width / 2;
              const half = tooltipWidth / 2;
              const clampedLeft = Math.min(
                Math.max(rawLeft, half + edgePadding),
                containerRect.width - half - edgePadding,
              );

              const topRaw = rect.bottom - containerRect.top + offsetY;
              const maxTop = containerRect.height - edgePadding;
              const clampedTop = Math.min(
                Math.max(edgePadding, topRaw),
                maxTop,
              );

              setTooltipPos({ left: clampedLeft, top: clampedTop });
              setTooltipMode('desktop');
            } else {
              setTooltipPos(null);
              setTooltipMode('mobile');
            }

            setHovered({
              id,
              label: data.label,
              company: data.company,
            });
          };

          const onLeave = () => setHovered(null);
          const onClick = () => onEnter();

          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
          el.addEventListener('click', onClick);

          listeners.push(() => {
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('click', onClick);
          });
        });

        cleanup = () => listeners.forEach((fn) => fn());
      } catch (err) {
        console.error(err);
        setError('Kunne ikke laste standkart akkurat nå.');
      }
    })();

    return () => cleanup?.();
  }, [activeDay]);

  return (
    <div className="relative mx-auto mt-20 mb-20 max-w-4xl">
      <div>
        <h2 className="text-center text-4xl font-medium">{title}</h2>
        <p className="text-m font-meduim p-4 text-center text-slate-600">
          {description}
        </p>
        <div className="flex justify-center pb-10">
          <ToggleSlider
            ariaLabel="Velg dag for standkart"
            value={activeDay}
            onChange={(nextDay) => {
              setActiveDay(nextDay);
              setHovered(null);
            }}
            options={[
              { value: 'february-9', label: '9. februar' },
              { value: 'february-10', label: '10. februar' },
            ]}
          />
        </div>
      </div>

      <div ref={ref} className="w-full [&_svg]:h-auto [&_svg]:w-full" />

      {error && (
        <div className="absolute top-4 left-4 bg-red-100 px-3 py-2 text-sm text-red-700 shadow">
          {error}
        </div>
      )}

      {hovered && tooltipMode === 'mobile' && (
        <div className="mt-6 w-full border-3 border-black bg-white px-5 py-4 text-sm shadow-[6px_6px_0px_#000]">
          <div className="text-base font-semibold">Stand {hovered.label}</div>
          <div className="text-slate-700">{hovered.company}</div>
        </div>
      )}

      {hovered && tooltipMode === 'desktop' && tooltipPos && (
        <div
          className="absolute z-10 w-[260px] border-3 border-black bg-white px-5 py-4 text-sm shadow-[6px_6px_0px_#000]"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <div className="text-base font-semibold">Stand {hovered.label}</div>
          <div className="text-slate-700">{hovered.company}</div>
        </div>
      )}
    </div>
  );
}

export default StandMap;
