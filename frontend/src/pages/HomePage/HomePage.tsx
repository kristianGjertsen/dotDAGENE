import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BuildingOffice2Icon,
  ClockIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';

import { Footer } from '../../components/PageSections/Footer/Footer';
import { Header } from '../../components/PageSections/Header/Header';
import { Info } from '../../components/Elements/Info';
import { InfoWithButton } from '../../components/Elements/InfoWithButton';
import { LinkButton } from '../../components/Elements/LinkButton';
import { BannerBig, BannerSmall, CalendarButton, Countdown } from '.';
import { AppLayout } from '../../components/Layout/AppLayout';
import StandMap from './StandMap/StandMap';
import { Reveal, ScrollJourney } from './HomeMotion';

const interactiveCardClass =
  'transition-[transform,box-shadow] duration-300 ease-out motion-reduce:transition-none sm:hover:-translate-y-1 sm:hover:shadow-[8px_8px_0_0_#000]';

export const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = 'hidden';

    return () => {
      document.body.style.overflowX = previousOverflowX;
    };
  }, []);

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
        <h1 className="sr-only">dotDAGENE 2027</h1>

        <div className="relative left-1/2 block w-screen -translate-x-1/2 md:hidden">
          <BannerSmall />
        </div>
        <div className="relative left-1/2 hidden w-screen -translate-x-1/2 md:block">
          <BannerBig />
        </div>

        <Reveal delay={120}>
          <Countdown />
        </Reveal>

        <ScrollJourney>
          <Reveal>
            <section className="px-6 py-20 sm:px-12 lg:px-20">
              <InfoWithButton
                titelChildren="Vi gjentar suksessen fra i fjor"
                color="white"
                backImg="white"
                className={interactiveCardClass}
                button={
                  <LinkButton link="/kontakt" color="primary" size="md">
                    Meld interesse
                  </LinkButton>
                }
              >
                dotDAGENE er karrieredagene innen digitalisering og teknologi,
                og etter suksessen fra i fjor gjennomføres arrangementet nå for
                andre gang av informatikkstudenter ved NTNU. Vi bygger videre
                på erfaringene fra det første arrangementet og samler fremtidens
                IT-talenter med bransjeledende bedrifter.
              </InfoWithButton>
            </section>
          </Reveal>

          <section className="px-6 py-20 sm:px-12 lg:px-20">
            <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 sm:flex-row">
              <Reveal className="flex w-full sm:w-1/2" delay={80}>
                <InfoWithButton
                  titelChildren="Flere hundre studenter"
                  color="white"
                  backImg="white"
                  button={null}
                  icon={UserGroupIcon}
                  className={interactiveCardClass}
                >
                  Velkommen til neste års møteplass for morgendagens teknologer!
                  Karrieredagene samler flere hundre studenter fra informatikk og
                  relaterte studieretninger.
                </InfoWithButton>
              </Reveal>

              <Reveal className="flex w-full sm:w-1/2" delay={160}>
                <InfoWithButton
                  titelChildren="Forrige dotDAGENE"
                  color="primary"
                  backImg="green"
                  icon={ClockIcon}
                  className={interactiveCardClass}
                  button={
                    <LinkButton
                      link="/forrige-dotdagene"
                      color="white"
                      size="md"
                    >
                      Se dotDAGENE 2026
                    </LinkButton>
                  }
                >
                  Se tilbake på dotDAGENE 2026 med deltakende bedrifter og
                  standkart.
                </InfoWithButton>
              </Reveal>
            </section>
          </section>

          <section className="px-6 pt-10 pb-30 sm:px-12 lg:px-20">
            <div className="flex flex-col flex-wrap items-center gap-20">
              <Reveal className="mx-auto max-w-5xl">
                <div>
                  <h2 className="text-center text-4xl font-medium">
                    Oppdag mulighetene
                  </h2>
                  <p className="mt-5 text-center">
                    dotDAGENE 2027 samler studenter og bedrifter innen teknologi
                    og digitalisering. Her kan du bygge nettverk, utforske
                    karrieremuligheter og møte aktører fra bransjen. Arrangementet
                    er en arena for nye kontakter, faglig inspirasjon og samarbeid
                    mellom studenter og næringsliv.
                  </p>
                </div>
              </Reveal>

              <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10">
                <Reveal className="flex w-full">
                  <InfoWithButton
                    titelChildren="Stands"
                    color="primary"
                    backImg="green"
                    button={<CalendarButton color="white" />}
                    icon={BuildingOffice2Icon}
                    className={interactiveCardClass}
                  >
                    <div className="flex w-full items-center justify-center">
                      <p className="w-[80%]">
                        Få egen stand på dotDAGENE og møt direkte med
                        informatikkstudenter. Perfekt mulighet til å rekruttere de
                        beste talentene innen digitalisering og teknologi.
                      </p>
                    </div>
                  </InfoWithButton>
                </Reveal>

                <Reveal delay={100}>
                  <StandMap
                    title="Standkart for dotDAGENE 2027"
                    description="Hover eller trykk på standene for å se hvem som står hvor."
                  />
                </Reveal>

                <Reveal className="flex w-full" delay={120}>
                  <Info
                    titelChildren="Kveldsarrangement"
                    color="white"
                    backImg="white"
                    icon={SparklesIcon}
                    className={interactiveCardClass}
                  >
                    <div className="flex w-full items-center justify-center">
                      <p className="w-[80%]">
                        Etter en dag fylt med stands og faglige samtaler inviterer
                        vi til et sosialt kveldsarrangement. Her får studenter og
                        bedrifter mulighet til å møtes i en mer uformell setting,
                        fortsette samtalene fra dagen og bygge relasjoner.
                      </p>
                    </div>
                  </Info>
                </Reveal>
              </section>
            </div>
          </section>
        </ScrollJourney>
      </AppLayout>
      <Footer />
    </>
  );
};
