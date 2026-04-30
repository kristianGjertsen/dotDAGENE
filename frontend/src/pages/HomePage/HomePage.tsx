import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BuildingOffice2Icon, ClockIcon, SparklesIcon, UserGroupIcon,
} from '@heroicons/react/20/solid';

import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { Info } from '../../components/Elements/Info';
import { InfoWithButton } from '../../components/Elements/InfoWithButton';
import { LinkButton } from '../../components/Elements/LinkButton';
import {
  BannerBig, BannerSmall,
  CalendarButton,
  Countdown,
} from '.';
import { AppLayout } from '../../components/Layout/AppLayout';

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
      <Header />
      <AppLayout>
        {/* H1 For at google/bing skal kunne lese overskrift, ikke synelig*/}
        <h1 className="sr-only">dotDAGENE 2025</h1>

        <div className="relative left-1/2 block w-screen -translate-x-1/2 md:hidden">
          <BannerSmall />
        </div>
        <div className="relative left-1/2 hidden w-screen -translate-x-1/2 md:block">
          <BannerBig />
        </div>

        <Countdown />
        <section className="px-6 py-20 sm:px-12 lg:px-20">
          <InfoWithButton
            titelChildren="Vi gjenntar suksessen fra i fjor"
            color="white"
            backImg="white"
            button={(
              <LinkButton link="/kontakt" color="primary" size="md">
                Kontakt oss
              </LinkButton>
            )}
          >
            dotDAGENE er karrieredagene innen digitalisering og teknologi, 
            og etter suksessen fra i fjor gjennomføres arrangementet nå for 
            andre gang av informatikkstudenter ved NTNU. Vi bygger videre på erfaringene 
            fra det første arrangementet og samler fremtidens IT-talenter med bransjeledende bedrifter.
          </InfoWithButton>
        </section>
        <section className="px-6 py-20 sm:px-12 lg:px-20">
          <section className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch">
            <Info
              titelChildren="500+ STUDENTER"
              color="white"
              backImg="white"
              icon={UserGroupIcon}>
              Velkommen til årets møteplass for morgendagens teknologer! Karrieredagene samler over 500 studenter fra informatikk og relaterte studieretninger.
            </Info>

            <InfoWithButton
              titelChildren="Forrige dotDAGENE"
              color="primary"
              icon={ClockIcon}
              backImg="green"
              button={(
                <LinkButton link="/forrige-dotdagene" color="white" size="md">
                  Se forrige dotDAGENE
                </LinkButton>
              )}
            >
              Se tilbake på forrige arrangement. Her kan vi samle høydepunkter,
              bilder, program og annet innhold fra tidligere dotDAGENE.
            </InfoWithButton>
          </section>
        </section>

        <section className="px-6 py-20  sm:px-12 lg:px-20">
          <div className="flex flex-col flex-wrap items-center gap-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-center text-4xl font-medium">
                Oppdag mulighetene
              </h2>
              <p className="mt-5 text-center">
                dotDAGENE 2027 samler studenter og bedrifter innen teknologi og digitalisering. 
                Her kan du bygge nettverk, utforske karrieremuligheter og møte aktører fra bransjen. 
                Arrangementet er en arena for nye kontakter, 
                faglig inspirasjon og samarbeid mellom studenter og næringsliv.
              </p>
            </div>

            <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 sm:flex-row">
              <div className="flex w-full sm:w-1/2">
                <InfoWithButton
                  titelChildren="Stands"
                  color="primary"
                  backImg="green"
                  button={<CalendarButton color="white" />}
                  icon={BuildingOffice2Icon}
                >
                  Få egen stand på dotDAGENE og møt direkte med
                  informatikkstudenter. Perfekt mulighet til å rekruttere de beste
                  talentene innen digitalisering og teknologi.
                </InfoWithButton>
              </div>

              <div className="flex w-full sm:w-1/2">
                <Info
                  titelChildren="Kveldsarrangement"
                  color="white"
                  backImg="white"
                  icon={SparklesIcon}
                >

                  Etter en dag full av stands , inviterer vi til et sosialt kveldsarrangement. Her kan studenter og bedrifter mingle i en mer uformell setting, bygge relasjoner
                </Info>
              </div>

            </section>
          </div>
        </section>


      </AppLayout >
      <Footer />
    </>
  );
};
