import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
import {
  BannerBig,
  BannerSmall,
  CalendarButton,
  ContactForm,
  ContactUs,
  Countdown,
  Info,
  InfoWithButton,
} from '../components/HomePage';

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const hash = location.hash.replace('#', '');

    const element = document.getElementById(hash);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, [location]);

  return (
    <>
      {/* H1 For at google/bing skal kunne lese overskrift, ikke synelig*/}
      <h1 className="sr-only">dotDAGENE 2025</h1>

      <Header />
      <section className="pt-15 px-4 sm:px-12 lg:px-20">
        <div className="relative mx-auto w-full max-w-3xl overflow-visible">
         
          <img
            src="/santaHat.gif"
            alt="nissehatt2"
            className="pointer-events-none absolute  top-1 z-30 h-16 w-auto -translate-y-[74%] object-contain sm:-right-[8px] sm:h-28 sm:-translate-y-[82%]"
          />
          <Link

            to="/advent"
            className="mt-10 flex flex-col items-center justify-center gap-2 border-3 border-black bg-red-500 p-4 text-center text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.18)] transition-transform duration-150 hover:translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <p className="text-sm font-semibold tracking-[0.35em] text-red-100">
              NYHET
            </p>
            <h2 className="text-3xl font-semibold md:text-4xl">
              dotDAGENE adventskalender 2025
            </h2>
          </Link>
        </div>
      </section>
      <div className="block md:hidden">
        <BannerSmall />
      </div>

      <div className="hidden md:block">
        <BannerBig />
      </div>
      <Countdown />



      <section className="mt-16 px-6 sm:px-12 lg:px-20">
        <section className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch">
          <Info
            titelChildren="500+ STUDENTER"
            color="purple"
            icon={UserGroupIcon}
          >
            Velkommen til neste års møteplass for morgendagens teknologer! Karrieredagen samler over 500 studenter fra informatikk og relaterte studieretninger.
          </Info>

          <Info
            titelChildren="HELT NYTT"
            color="green"
            icon={SparklesIcon}
          >
            Vær blant de første som får oppleve et helt nytt arrangement for studenter og bedrifter innen IT og teknologi.
          </Info>
        </section>
      </section>

      <section className="px-6 sm:px-12 lg:px-20">
        <div className="mt-16 flex flex-col flex-wrap items-center gap-4">
          <div className="w-full">

            <h2 className="text-center text-4xl font-medium">
              OPPDAG MULIGHETENE
            </h2>
            <p className="mt-5 text-center">
              dotDAGENE 2026 bringer sammen studenter og bedrifter.
              Her får du sjansen til å bygge nettverk, utforske fremtidige karriereveier og oppleve hvordan teknologi og samarbeid skaper nye muligheter.
              Enten du kommer for å møte potensielle arbeidsgivere, vise frem bedriften din, eller bare bli inspirert, er dotDAGENE stedet der nye ideer og kontakter oppstår
            </p>
          </div>

          <section className="mt-20 flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 sm:mt-20 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <InfoWithButton
                titelChildren="STANDS"
                color="green"
                button={<CalendarButton color="purple" />}
                icon={BuildingOffice2Icon}
              >
                Få egen stand på dotDAGENE og møt direkte med
                informatikkstudenter. Perfekt mulighet til å rekruttere de beste
                talentene innen digitalisering og teknologi.
              </InfoWithButton>
            </div>

          </section>
        </div>
      </section>

      <section className="mx-6 my-32 sm:mx-12 lg:mx-24">
        <div className="flex w-full flex-col items-center justify-center gap-6 border-3 border-black bg-white p-8 lg:px-32 lg:py-16">
          <h2 className="text-center text-4xl font-medium md:text-6xl">
            HVEM ER VI?
          </h2>
          <p className="mt-2 max-w-3xl text-center">
            NTNUs nyeste karrieredag innen digitalisering og teknologi.
            Arrangert av informatikkstudenter for å koble sammen fremtidens
            IT-talenter med bransjeledende bedrifter.
          </p>
        </div>
      </section>

      <section className="px-6 sm:px-12 lg:px-20">
        <section className="flex flex-col items-stretch justify-center gap-8 lg:flex-row">
          <div className="bg-dotyellow flex w-full flex-col gap-4 border-3 border-black p-8">
            <h3 className="text-3xl">Interesseskjema</h3>
            <p>
              Fyll ut skjemaet så tar vi kontakt for å diskutere
              mulighetene.
            </p>
            <ContactForm />
          </div>
          <ContactUs />
        </section>
      </section>

      <Footer />
    </>
  );
};
