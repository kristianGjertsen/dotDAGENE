import { useRef } from 'react';
import type { IconHandle } from '@animateicons/react';
import {
  CalendarDays,
  Instagram,
  Linkedin,
  Mail,
  MapPinIcon,
} from '@animateicons/react/lucide';
import AnimatedLogo from './AnimatedLogo';
import { FooterPattern } from './FooterPattern';

export const Footer = () => {
  const mailIconRef = useRef<IconHandle>(null);
  const calendarIconRef = useRef<IconHandle>(null);
  const mapPinIconRef = useRef<IconHandle>(null);

  return (
    <FooterPattern>
      <section className="footer-pattern__content relative z-10 mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 pt-14 pb-4 sm:px-12 sm:pt-12 lg:px-16 lg:pt-10">
        <div className="flex flex-col gap-8 border-b-1 border-gray-100/80 pb-5 md:flex-row md:items-start md:justify-between">
          <section className="max-w-md">
            <AnimatedLogo className="md:mb-4" />
            <p className="mt-4 max-w-sm text-gray-100 md:text-xl">
              NTNUs nyeste karrieredag innen digitalisering og teknologi.
            </p>
          </section>

          <section className="flex flex-col gap-3 text-gray-100">
            <h2 className="text-lg md:text-2xl">Følg oss</h2>
            <div className="flex w-full gap-4">
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

            <div className="max-w-[220px] flex flex-col items-center">
              <Mail
                ref={mailIconRef}
                size={35}
                className="text-tertiary h-8 w-8 shrink-0 mb-2"
              />
              <a
                href="mailto:kontakt@dotdagene.no"
                className="hover:text-tertiary transition-colors duration-150"
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
            <div className="max-w-[220px] flex flex-col items-center">
              <CalendarDays
                ref={calendarIconRef}
                size={35}
                className="text-tertiary h-8 w-8 shrink-0 mb-2"
              />
              <p>9 og 10. februar 2027</p>
            </div>
          </div>
          <div
            className="flex items-start gap-4 md:justify-self-center"
            onMouseEnter={() => mapPinIconRef.current?.startAnimation()}
            onMouseLeave={() => mapPinIconRef.current?.stopAnimation()}
          >

            <div className="max-w-[220px] flex flex-col items-center text-center">
              <MapPinIcon
                ref={mapPinIconRef}
                size={35}
                className="text-tertiary h-8 w-8 shrink-0 mb-2"
              />
              <a
                href="https://use.mazemap.com/#v=1&config=ntnu&campusid=1&zlevel=-1&center=10.405303,63.415515&zoom=17.9&search=realfagbygget&sharepoitype=poi&sharepoi=1000459313"
                target="_blank"
                rel="noreferrer"
                className="hover:text-tertiary transition-colors duration-150"
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
    </FooterPattern>
  );
};
