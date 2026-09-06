import {
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

type FooterAnimationMode = 'pulse' | 'draw' | 'motion' | 'color';

const footerAnimationModes: ReadonlyArray<{
  id: FooterAnimationMode;
  label: string;
}> = [
  { id: 'pulse', label: 'Puls' },
  { id: 'draw', label: 'Tegn' },
  { id: 'motion', label: 'Bevegelse' },
  { id: 'color', label: 'Farge' },
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

export const Footer = () => {
  const backImageRotation = useMemo(() => getRandomBackImageRotation(), []);
  const mailIconRef = useRef<IconHandle>(null);
  const calendarIconRef = useRef<IconHandle>(null);
  const mapPinIconRef = useRef<IconHandle>(null);
  const footerRef = useRef<HTMLElement>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const [animationIndex, setAnimationIndex] = useState(0);

  const activeAnimation = footerAnimationModes[animationIndex];

  const updatePointerVariables = (x: number, y: number) => {
    const footer = footerRef.current;
    if (!footer) return;

    const xShift = (x - 0.5) * 34;
    const yShift = (y - 0.5) * 22;

    footer.style.setProperty('--footer-pointer-x', `${x * 100}%`);
    footer.style.setProperty('--footer-pointer-y', `${y * 100}%`);
    footer.style.setProperty('--footer-shift-x', `${xShift}px`);
    footer.style.setProperty('--footer-shift-y', `${yShift}px`);
    footer.style.setProperty('--footer-shift-x-inverse', `${-xShift * 0.7}px`);
    footer.style.setProperty('--footer-shift-y-inverse', `${-yShift * 0.7}px`);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const footer = footerRef.current;
    if (!footer) return;

    const rect = footer.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
    }

    pointerFrameRef.current = requestAnimationFrame(() => {
      updatePointerVariables(x, y);
      pointerFrameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }

    updatePointerVariables(0.5, 0.5);
  };

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

      <footer
        ref={footerRef}
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

        <section className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 pb-4 pt-14 sm:px-12 sm:pt-12 lg:px-16 lg:pt-10">
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
