import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import type { IconHandle } from '@animateicons/react';
import backtemp from '../../../assets/backgroundInv.svg';
import {
  CalendarDays,
  Instagram,
  Linkedin,
  Mail,
  MapPinIcon,
} from '@animateicons/react/lucide';
import AnimatedLogo from './AnimatedLogo';
import './FooterPattern.css';

type FooterAnimationMode =
  | 'pulse'
  | 'draw'
  | 'motion'
  | 'color'
  | 'fusion'
  | 'chaos';

type AnimationSettings = {
  baseOpacity: number;
  pulseRadius: number;
  pulseOpacity: number;
  pulseScale: number;
  pulseDuration: number;
  drawRadius: number;
  drawOpacity: number;
  drawBrightness: number;
  motionX: number;
  motionY: number;
  motionAOpacity: number;
  motionBOpacity: number;
  motionAScale: number;
  motionBScale: number;
  colorRadius: number;
  colorOpacity: number;
  glowOpacity: number;
  colorScale: number;
  colorDuration: number;
  contentShift: number;
  chaosRotate: number;
};

type SettingKey = keyof AnimationSettings;

type ControlDefinition = {
  key: SettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  modes: FooterAnimationMode[];
};

const footerAnimationModes: ReadonlyArray<{
  id: FooterAnimationMode;
  label: string;
}> = [
  { id: 'pulse', label: 'Puls' },
  { id: 'draw', label: 'Tegn' },
  { id: 'motion', label: 'Bevegelse' },
  { id: 'color', label: 'Farge' },
  { id: 'fusion', label: 'Alt' },
  { id: 'chaos', label: 'Kaos' },
];

const baseSettings: AnimationSettings = {
  baseOpacity: 0.2,
  pulseRadius: 340,
  pulseOpacity: 0.82,
  pulseScale: 1.18,
  pulseDuration: 2.7,
  drawRadius: 125,
  drawOpacity: 0.86,
  drawBrightness: 1.22,
  motionX: 20,
  motionY: 14,
  motionAOpacity: 0.28,
  motionBOpacity: 0.38,
  motionAScale: 1.04,
  motionBScale: 1.08,
  colorRadius: 340,
  colorOpacity: 0.46,
  glowOpacity: 0.68,
  colorScale: 1.035,
  colorDuration: 5,
  contentShift: 0,
  chaosRotate: 0,
};

const defaultsByMode: Record<FooterAnimationMode, AnimationSettings> = {
  pulse: {
    ...baseSettings,
    baseOpacity: 0.16,
    pulseRadius: 370,
    pulseOpacity: 0.9,
    pulseScale: 1.2,
  },
  draw: {
    ...baseSettings,
    baseOpacity: 0.055,
    drawRadius: 145,
    drawOpacity: 0.96,
    drawBrightness: 1.35,
  },
  motion: {
    ...baseSettings,
    baseOpacity: 0.14,
    motionX: 24,
    motionY: 18,
    motionAOpacity: 0.3,
    motionBOpacity: 0.46,
    motionAScale: 1.05,
    motionBScale: 1.1,
  },
  color: {
    ...baseSettings,
    baseOpacity: 0.15,
    colorRadius: 370,
    colorOpacity: 0.58,
    glowOpacity: 0.76,
    colorScale: 1.045,
  },
  fusion: {
    ...baseSettings,
    baseOpacity: 0.11,
    pulseRadius: 320,
    pulseOpacity: 0.55,
    pulseScale: 1.1,
    pulseDuration: 3.1,
    drawRadius: 115,
    drawOpacity: 0.68,
    drawBrightness: 1.25,
    motionX: 18,
    motionY: 12,
    motionAOpacity: 0.16,
    motionBOpacity: 0.27,
    motionAScale: 1.035,
    motionBScale: 1.07,
    colorRadius: 330,
    colorOpacity: 0.36,
    glowOpacity: 0.48,
    colorScale: 1.03,
    colorDuration: 4.2,
    contentShift: 2,
  },
  chaos: {
    ...baseSettings,
    baseOpacity: 0.08,
    pulseRadius: 430,
    pulseOpacity: 1,
    pulseScale: 1.32,
    pulseDuration: 1.65,
    drawRadius: 185,
    drawOpacity: 1,
    drawBrightness: 1.65,
    motionX: 62,
    motionY: 44,
    motionAOpacity: 0.46,
    motionBOpacity: 0.72,
    motionAScale: 1.11,
    motionBScale: 1.2,
    colorRadius: 500,
    colorOpacity: 0.82,
    glowOpacity: 1,
    colorScale: 1.09,
    colorDuration: 1.6,
    contentShift: 9,
    chaosRotate: 2.4,
  },
};

const combinedModes: FooterAnimationMode[] = ['fusion', 'chaos'];

const controls: ControlDefinition[] = [
  {
    key: 'baseOpacity',
    label: 'Bakgrunn opacity',
    min: 0,
    max: 0.45,
    step: 0.01,
    modes: footerAnimationModes.map((mode) => mode.id),
  },
  {
    key: 'pulseRadius',
    label: 'Puls radius',
    min: 120,
    max: 620,
    step: 10,
    unit: 'px',
    modes: ['pulse', ...combinedModes],
  },
  {
    key: 'pulseOpacity',
    label: 'Puls styrke',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['pulse', ...combinedModes],
  },
  {
    key: 'pulseScale',
    label: 'Puls distortion',
    min: 1,
    max: 1.5,
    step: 0.01,
    modes: ['pulse', ...combinedModes],
  },
  {
    key: 'pulseDuration',
    label: 'Puls hastighet',
    min: 0.7,
    max: 7,
    step: 0.1,
    unit: 's',
    modes: ['pulse', ...combinedModes],
  },
  {
    key: 'drawRadius',
    label: 'Tegne radius',
    min: 40,
    max: 340,
    step: 5,
    unit: 'px',
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'drawOpacity',
    label: 'Tegne styrke',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'drawBrightness',
    label: 'Tegne lysstyrke',
    min: 0.8,
    max: 2,
    step: 0.02,
    modes: ['draw', ...combinedModes],
  },
  {
    key: 'motionX',
    label: 'Bevegelse X',
    min: 0,
    max: 90,
    step: 1,
    unit: 'px',
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionY',
    label: 'Bevegelse Y',
    min: 0,
    max: 70,
    step: 1,
    unit: 'px',
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionAOpacity',
    label: 'Motion lag 1',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionBOpacity',
    label: 'Motion lag 2',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionAScale',
    label: 'Motion scale 1',
    min: 1,
    max: 1.3,
    step: 0.01,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'motionBScale',
    label: 'Motion scale 2',
    min: 1,
    max: 1.4,
    step: 0.01,
    modes: ['motion', ...combinedModes],
  },
  {
    key: 'colorRadius',
    label: 'Farge radius',
    min: 120,
    max: 700,
    step: 10,
    unit: 'px',
    modes: ['color', ...combinedModes],
  },
  {
    key: 'colorOpacity',
    label: 'Mønsterfarge',
    min: 0,
    max: 1,
    step: 0.02,
    modes: ['color', ...combinedModes],
  },
  {
    key: 'glowOpacity',
    label: 'Farge glow',
    min: 0,
    max: 1.3,
    step: 0.02,
    modes: ['color', ...combinedModes],
  },
  {
    key: 'colorScale',
    label: 'Farge pust',
    min: 1,
    max: 1.2,
    step: 0.005,
    modes: ['color', ...combinedModes],
  },
  {
    key: 'colorDuration',
    label: 'Farge hastighet',
    min: 0.7,
    max: 9,
    step: 0.1,
    unit: 's',
    modes: ['color', ...combinedModes],
  },
  {
    key: 'contentShift',
    label: 'Innhold parallax',
    min: 0,
    max: 22,
    step: 1,
    unit: 'px',
    modes: combinedModes,
  },
  {
    key: 'chaosRotate',
    label: 'Kaos rotasjon',
    min: 0,
    max: 8,
    step: 0.1,
    unit: '°',
    modes: ['chaos'],
  },
];

// Function to randomly return a rotation class for the background image
const getRandomBackImageRotation = () => {
  return Math.random() < 0.5 ? 'rotate-180' : '';
};

type PatternLayerProps = {
  className: string;
  rotationClass: string;
};

const PatternLayer = ({ className, rotationClass }: PatternLayerProps) => (
  <div className={className} aria-hidden="true">
    <div
      className={`footer-pattern__image ${rotationClass}`}
      style={{ backgroundImage: `url(${backtemp})` }}
    />
  </div>
);

const formatSettingValue = (control: ControlDefinition, value: number) => {
  const decimals = control.step < 0.01 ? 3 : control.step < 1 ? 2 : 0;
  return `${value.toFixed(decimals)}${control.unit ?? ''}`;
};

export const Footer = () => {
  const backImageRotation = useMemo(() => getRandomBackImageRotation(), []);
  const mailIconRef = useRef<IconHandle>(null);
  const calendarIconRef = useRef<IconHandle>(null);
  const mapPinIconRef = useRef<IconHandle>(null);
  const footerRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const trailFrameRef = useRef<number | null>(null);
  const pointerTargetRef = useRef({ x: 0.5, y: 0.5 });
  const trailRef = useRef([
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ]);
  const pointerInsideRef = useRef(false);
  const [animationIndex, setAnimationIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [settingsByMode, setSettingsByMode] = useState<
    Record<FooterAnimationMode, AnimationSettings>
  >(() => ({
    pulse: { ...defaultsByMode.pulse },
    draw: { ...defaultsByMode.draw },
    motion: { ...defaultsByMode.motion },
    color: { ...defaultsByMode.color },
    fusion: { ...defaultsByMode.fusion },
    chaos: { ...defaultsByMode.chaos },
  }));

  const activeAnimation = footerAnimationModes[animationIndex];
  const activeSettings = settingsByMode[activeAnimation.id];
  const activeControls = controls.filter((control) =>
    control.modes.includes(activeAnimation.id),
  );

  const updatePointerVariables = (x: number, y: number) => {
    const footer = footerRef.current;
    if (!footer) return;

    const xShift = (x - 0.5) * 2 * activeSettings.motionX;
    const yShift = (y - 0.5) * 2 * activeSettings.motionY;
    const contentX = (x - 0.5) * 2 * activeSettings.contentShift;
    const contentY = (y - 0.5) * 2 * activeSettings.contentShift * 0.65;
    const contentRotate = (x - 0.5) * activeSettings.chaosRotate * 0.24;

    footer.style.setProperty('--footer-pointer-x', `${x * 100}%`);
    footer.style.setProperty('--footer-pointer-y', `${y * 100}%`);
    footer.style.setProperty('--footer-shift-x', `${xShift}px`);
    footer.style.setProperty('--footer-shift-y', `${yShift}px`);
    footer.style.setProperty('--footer-shift-x-inverse', `${-xShift * 0.72}px`);
    footer.style.setProperty('--footer-shift-y-inverse', `${-yShift * 0.72}px`);
    footer.style.setProperty('--footer-content-x', `${contentX}px`);
    footer.style.setProperty('--footer-content-y', `${contentY}px`);
    footer.style.setProperty('--footer-content-rotate', `${contentRotate}deg`);
  };

  const updateTrailVariables = () => {
    const footer = footerRef.current;
    if (!footer || !pointerInsideRef.current) {
      trailFrameRef.current = null;
      return;
    }

    const target = pointerTargetRef.current;
    const trail = trailRef.current;
    const follow = [0.22, 0.14, 0.09, 0.055];

    trail.forEach((point, index) => {
      const leader = index === 0 ? target : trail[index - 1];
      point.x += (leader.x - point.x) * follow[index];
      point.y += (leader.y - point.y) * follow[index];
      footer.style.setProperty(`--footer-trail-${index + 1}-x`, `${point.x * 100}%`);
      footer.style.setProperty(`--footer-trail-${index + 1}-y`, `${point.y * 100}%`);
    });

    trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
  };

  useEffect(() => {
    return () => {
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
      if (trailFrameRef.current !== null) {
        cancelAnimationFrame(trailFrameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    pointerTargetRef.current = { x, y };
    pointerInsideRef.current = true;

    if (trailFrameRef.current === null) {
      trailFrameRef.current = requestAnimationFrame(updateTrailVariables);
    }

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
    }

    pointerFrameRef.current = requestAnimationFrame(() => {
      updatePointerVariables(x, y);
      pointerFrameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    pointerInsideRef.current = false;

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }
    if (trailFrameRef.current !== null) {
      cancelAnimationFrame(trailFrameRef.current);
      trailFrameRef.current = null;
    }

    pointerTargetRef.current = { x: 0.5, y: 0.5 };
    trailRef.current = trailRef.current.map(() => ({ x: 0.5, y: 0.5 }));
    updatePointerVariables(0.5, 0.5);
  };

  const updateSetting = (key: SettingKey, value: number) => {
    setSettingsByMode((current) => ({
      ...current,
      [activeAnimation.id]: {
        ...current[activeAnimation.id],
        [key]: value,
      },
    }));
  };

  const resetActiveSettings = () => {
    setSettingsByMode((current) => ({
      ...current,
      [activeAnimation.id]: { ...defaultsByMode[activeAnimation.id] },
    }));
  };

  const footerStyle = {
    '--footer-base-opacity': activeSettings.baseOpacity,
    '--footer-pulse-radius': `${activeSettings.pulseRadius}px`,
    '--footer-pulse-opacity': activeSettings.pulseOpacity,
    '--footer-pulse-scale': activeSettings.pulseScale,
    '--footer-pulse-duration': `${activeSettings.pulseDuration}s`,
    '--footer-draw-radius': `${activeSettings.drawRadius}px`,
    '--footer-draw-opacity': activeSettings.drawOpacity,
    '--footer-draw-brightness': activeSettings.drawBrightness,
    '--footer-motion-a-opacity': activeSettings.motionAOpacity,
    '--footer-motion-b-opacity': activeSettings.motionBOpacity,
    '--footer-motion-a-scale': activeSettings.motionAScale,
    '--footer-motion-b-scale': activeSettings.motionBScale,
    '--footer-color-radius': `${activeSettings.colorRadius}px`,
    '--footer-color-opacity': activeSettings.colorOpacity,
    '--footer-glow-opacity': activeSettings.glowOpacity,
    '--footer-color-scale': activeSettings.colorScale,
    '--footer-color-duration': `${activeSettings.colorDuration}s`,
    '--footer-chaos-rotate': `${activeSettings.chaosRotate}deg`,
    '--footer-chaos-rotate-negative': `${-activeSettings.chaosRotate}deg`,
  } as CSSProperties;

  return (
    <div className="footer-pattern-shell">
      <div className="footer-animation-control">
        <div className="footer-animation-control__topline">
          <span className="footer-animation-control__eyebrow">Mønster</span>
          <span className="footer-animation-control__active">
            {activeAnimation.label}
          </span>
        </div>
        <input
          className="footer-animation-control__slider"
          type="range"
          min={0}
          max={footerAnimationModes.length - 1}
          step={1}
          value={animationIndex}
          onChange={(event) => setAnimationIndex(Number(event.currentTarget.value))}
          aria-label="Velg footer-animasjon"
          aria-valuetext={activeAnimation.label}
          style={
            {
              '--footer-slider-progress': `${(animationIndex / (footerAnimationModes.length - 1)) * 100}%`,
            } as CSSProperties
          }
        />
        <div className="footer-animation-control__labels" aria-hidden="true">
          {footerAnimationModes.map((mode) => (
            <span key={mode.id}>{mode.label}</span>
          ))}
        </div>
      </div>

      {panelOpen ? (
        <aside className="footer-tuning-panel" aria-label="Animasjonsinnstillinger">
          <div className="footer-tuning-panel__header">
            <div>
              <span className="footer-tuning-panel__eyebrow">Live controls</span>
              <strong>{activeAnimation.label}</strong>
            </div>
            <button type="button" onClick={() => setPanelOpen(false)}>
              Skjul
            </button>
          </div>
          <div className="footer-tuning-panel__actions">
            <span>{activeControls.length} variabler</span>
            <button type="button" onClick={resetActiveSettings}>
              Nullstill
            </button>
          </div>
          <div className="footer-tuning-panel__controls">
            {activeControls.map((control) => {
              const value = activeSettings[control.key];
              return (
                <label className="footer-tuning-panel__control" key={control.key}>
                  <span>
                    <span>{control.label}</span>
                    <output>{formatSettingValue(control, value)}</output>
                  </span>
                  <input
                    type="range"
                    min={control.min}
                    max={control.max}
                    step={control.step}
                    value={value}
                    onChange={(event) =>
                      updateSetting(control.key, Number(event.currentTarget.value))
                    }
                  />
                </label>
              );
            })}
          </div>
        </aside>
      ) : (
        <button
          type="button"
          className="footer-tuning-panel-toggle"
          onClick={() => setPanelOpen(true)}
        >
          Juster animasjon
        </button>
      )}

      <footer
        ref={footerRef}
        style={footerStyle}
        className={`footer-pattern footer-pattern--${activeAnimation.id} relative overflow-hidden border-t-2 border-black bg-footer`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <PatternLayer
          className="footer-pattern__layer footer-pattern__base"
          rotationClass={backImageRotation}
        />
        <PatternLayer
          className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--pulse"
          rotationClass={backImageRotation}
        />
        <PatternLayer
          className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--draw"
          rotationClass={backImageRotation}
        />
        <PatternLayer
          className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--motion-a"
          rotationClass={backImageRotation}
        />
        <PatternLayer
          className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--motion-b"
          rotationClass={backImageRotation}
        />
        <PatternLayer
          className="footer-pattern__layer footer-pattern__effect footer-pattern__effect--color"
          rotationClass={backImageRotation}
        />
        <div className="footer-pattern__color-wash" aria-hidden="true" />

        <section className="footer-pattern__content relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 pb-4 pt-14 sm:px-12 sm:pt-12 lg:px-16 lg:pt-10">
          <div className="flex flex-col gap-8 border-b-1 border-gray-100/80 pb-5 md:flex-row md:items-start md:justify-between">
            <section className="max-w-md">
              <AnimatedLogo className="md:mb-4" />
              <p className="mt-4 max-w-sm text-gray-100 md:text-xl">
                NTNUs nyeste karrieredag innen digitalisering og teknologi.
              </p>
            </section>

            <section className="flex flex-col gap-3 text-gray-100">
              <h2 className="text-lg md:text-2xl">Følg oss</h2>
              <div className="flex w-full justify-between">
                <a
                  href="https://www.instagram.com/dotdagene/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Instagram size={35} />
                </a>
                <a
                  href="https://www.linkedin.com/company/dotdagene/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin size={35} />
                </a>
              </div>
            </section>
          </div>

          <section className="mx-auto grid w-full max-w-5xl gap-8 text-gray-100 md:grid-cols-3 md:gap-10">
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => mailIconRef.current?.startAnimation()}
              onMouseLeave={() => mailIconRef.current?.stopAnimation()}
            >
              <Mail
                ref={mailIconRef}
                className="h-8 w-8 shrink-0 text-tertiary"
              />
              <div className="max-w-[220px]">
                <p className="text-md font-semibold tracking-[0.2em]">E-post</p>
                <a
                  href="mailto:kontakt@dotdagene.no"
                  className="transition-colors duration-150 hover:text-tertiary"
                >
                  kontakt@dotdagene.no
                </a>
              </div>
            </div>
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => calendarIconRef.current?.startAnimation()}
              onMouseLeave={() => calendarIconRef.current?.stopAnimation()}
            >
              <CalendarDays
                ref={calendarIconRef}
                className="h-8 w-8 shrink-0 text-tertiary"
              />
              <div className="max-w-[220px]">
                <p className="text-md font-semibold tracking-[0.2em]">Dato</p>
                <p>9 og 10. februar 2027</p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 md:justify-self-center"
              onMouseEnter={() => mapPinIconRef.current?.startAnimation()}
              onMouseLeave={() => mapPinIconRef.current?.stopAnimation()}
            >
              <MapPinIcon
                ref={mapPinIconRef}
                className="h-8 w-8 shrink-0 text-tertiary"
              />
              <div className="max-w-[260px]">
                <p className="text-md font-semibold tracking-[0.2em]">
                  Lokasjon
                </p>
                <a
                  href="https://use.mazemap.com/#v=1&config=ntnu&campusid=1&zlevel=-1&center=10.405303,63.415515&zoom=17.9&search=realfagbygget&sharepoitype=poi&sharepoi=1000459313"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-150 hover:text-tertiary"
                >
                  Realfagbygget U1 NTNU Gløshaugen, Trondheim
                </a>
              </div>
            </div>
          </section>

          <p className="w-full pt-2 text-center text-gray-100">
            © 2026 dotDAGENE
          </p>
        </section>
      </footer>
    </div>
  );
};
