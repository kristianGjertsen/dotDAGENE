import {
  CalendarIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/20/solid';
import Logo from '../../assets/litenDfarget.svg';
import Instagram from '../../assets/instagram.svg';
import Linkedin from '../../assets/linkedin.svg';
import backtemp from '../../assets/footerImage.png';

export const Footer = () => {
  return (
    <footer className="border-t-3 border-black  bg-cover bg-center"
      style={{ backgroundImage: `url(${backtemp})` }}>
      <section className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-8 py-12 sm:px-12 lg:px-16">
        <div className="flex flex-col gap-8 border-b-1 border-gray-100/80 pb-8 md:flex-row md:items-start md:justify-between">
          <section className="max-w-md">
            <img src={Logo} alt="Logo" className="w-16 md:mb-4" />
            <p className="mt-4 max-w-sm text-gray-100 md:text-xl">
              NTNUs nyeste karrieredag innen digitalisering og teknologi.
            </p>
          </section>

          <section className="flex flex-col gap-3 text-gray-100 md:items-end">
            <h2 className="text-lg md:text-2xl">Følg oss</h2>
            <section className="flex gap-3">
              <a className="w-10" href="https://www.instagram.com/dotdagene/">
                <img src={Instagram} alt="dotDAGENE på Instagram" />
              </a>
              <a className="w-10" href="https://www.linkedin.com/company/dotdagene/about/">
                <img src={Linkedin} alt="dotDAGENE på LinkedIn" />
              </a>
            </section>
          </section>
        </div>

        <section className="mx-auto grid w-full max-w-5xl gap-8 text-gray-100 md:grid-cols-3 md:gap-10">
          <div className="flex items-start gap-4 md:justify-self-center">
            <EnvelopeIcon className="h-8 w-8 shrink-0 text-tertiary" />
            <div className="max-w-[220px]">
              <p className="text-md font-semibold tracking-[0.2em]">E-Post</p>
              <a
                href="mailto:kontakt@dotdagene.no"
                className="transition-colors duration-150 hover:text-tertiary"
              >
                kontakt@dotdagene.no
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 md:justify-self-center">
            <CalendarIcon className="h-8 w-8 shrink-0 text-tertiary" />
            <div className="max-w-[220px]">
              <p className="text-md font-semibold tracking-[0.2em]">Dato</p>
              <p>9 og 10. februar 2027</p>
            </div>
          </div>

          <div className="flex items-start gap-4 md:justify-self-center">
            <MapPinIcon className="h-8 w-8 shrink-0 text-tertiary" />
            <div className="max-w-[260px]">
              <p className="text-md font-semibold tracking-[0.2em]">Lokasjon</p>
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
  );
};
