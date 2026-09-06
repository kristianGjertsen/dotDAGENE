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
import { HomeJourneyLine } from './HomeJourneyLine';
import StandMap from './StandMap/StandMap';

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
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.home-scroll-reveal'),
    );

    if (elements.length === 0) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotion.matches || typeof IntersectionObserver === 'undefined') {
      elements.forEach((element) =>
        element.classList.add('home-scroll-reveal-visible'),
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          entry.target.classList.add('home-scroll-reveal-visible');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
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
        {/* H1 For at google/bing skal kunne lese overskrift, ikke synelig*/}
        <h1 className="sr-only">dotDAGENE 2025</h1>

        <div className="relative left-1/2 block w-screen -translate-x-1/2 md:hidden">
          <BannerSmall />
        </div>
        <div className="relative left-1/2 hidden w-screen -translate-x-1/2 md:block">
          <BannerBig />
        </div>

        <div className="relative isolate">
          <HomeJourneyLine />

          <div className="home-scroll-reveal relative z-[6]">
            <Countdown />
          </div>

          <section className="px-6 py-20 sm:px-12 lg:px-20">
            <div
              data-journey-anchor
              data-journey-x="0.86"
              data-journey-y="0.56"
            >
              <InfoWithButton
                titelChildren="Vi gjentar suksessen fra i fjor"
                color="white"
                backImg="white"
                className="home-card-motion"
                button={
                  <LinkButton link="/kontakt" color="primary" size="md">
                    Meld interesse
                  </LinkButton>
                }
              >
                dotDAGENE er karrieredagene innen digitalisering og teknologi, og
                etter suksessen fra i fjor gjennomføres arrangementet nå for andre
                gang av informatikkstudenter ved NTNU. Vi bygger videre på
                erfaringene fra det første arrangementet og samler fremtidens
                IT-talenter med bransjeledende bedrifter.
              </InfoWithButton>
            </div>
          </section>

          <section className="px-6 py-20 sm:px-12 lg:px-20">
            <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 sm:flex-row">
              <div
                className="flex w-full sm:w-1/2"
                data-journey-anchor
                data-journey-x="0.18"
                data-journey-y="0.52"
              >
                <InfoWithButton
                  titelChildren="Flere hundre studenter"
                  color="white"
                  backImg="white"
                  button={null}
                  icon={UserGroupIcon}
                  className="home-card-motion"
                >
                  Velkommen til neste års møteplass for morgendagens teknologer!
                  Karrieredagene samler flere hundre studenter fra informatikk og
                  relaterte studieretninger.
                </InfoWithButton>
              </div>

              <div
                className="flex w-full sm:w-1/2"
                data-journey-anchor
                data-journey-x="0.82"
                data-journey-y="0.52"
              >
                <InfoWithButton
                  titelChildren="Forrige dotDAGENE"
                  color="primary"
                  backImg="green"
                  icon={ClockIcon}
                  className="home-card-motion"
                  button={
                    <LinkButton link="/forrige-dotdagene" color="white" size="md">
                      Se dotDAGENE 2026
                    </LinkButton>
                  }
                >
                  Se tilbake på dotDAGENE 2026 med deltakende bedrifter og
                  standkart.
                </InfoWithButton>
              </div>
            </section>
          </section>

          <section className="px-6 pt-10 pb-30 sm:px-12 lg:px-20">
            <div className="flex flex-col flex-wrap items-center gap-20">
              <div
                className="home-scroll-reveal relative z-[6] mx-auto max-w-5xl"
                data-journey-anchor
                data-journey-x="1.08"
                data-journey-y="0.5"
              >
                <h2 className="text-center text-4xl font-medium">
                  Oppdag mulighetene
                </h2>
                <p className="mt-5 text-center">
                  dotDAGENE 2027 samler studenter og bedrifter innen teknologi og
                  digitalisering. Her kan du bygge nettverk, utforske
                  karrieremuligheter og møte aktører fra bransjen. Arrangementet
                  er en arena for nye kontakter, faglig inspirasjon og samarbeid
                  mellom studenter og næringsliv.
                </p>
              </div>

              <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10">
                <div
                  className="flex w-full"
                  data-journey-anchor
                  data-journey-x="0.16"
                  data-journey-y="0.56"
                >
                  <InfoWithButton
                    titelChildren="Stands"
                    color="primary"
                    backImg="green"
                    button={<CalendarButton color="white" />}
                    icon={BuildingOffice2Icon}
                    className="home-card-motion"
                  >
                    <div className="flex w-full items-center justify-center">
                      <p className="w-[80%]">
                        Få egen stand på dotDAGENE og møt direkte med
                        informatikkstudenter. Perfekt mulighet til å rekruttere de
                        beste talentene innen digitalisering og teknologi.
                      </p>
                    </div>
                  </InfoWithButton>
                </div>

                <div
                  className="home-scroll-reveal relative z-[6]"
                  data-journey-anchor
                  data-journey-x="-0.08"
                  data-journey-y="0.5"
                >
                  <StandMap
                    title="Standkart for dotDAGENE 2027"
                    description="Hover eller trykk på standene for å se hvem som står hvor."
                  />
                </div>

                <div
                  className="flex w-full"
                  data-journey-anchor
                  data-journey-x="0.84"
                  data-journey-y="0.52"
                >
                  <Info
                    titelChildren="Kveldsarrangement"
                    color="white"
                    backImg="white"
                    icon={SparklesIcon}
                    className="home-card-motion"
                  >
                    <div className="flex w-full items-center justify-center">
                      <p className="w-[80%]">
                        Etter en dag fylt med stands og faglige samtaler inviterer
                        vi til et sosialt kveldsarrangement. Her får studenter og
                        bedrifter mulighet til å møtes i en mer uformell setting,
                        fortsette samtalene fra dagen og bygge relasjoner
                      </p>
                    </div>
                  </Info>
                </div>
              </section>
            </div>
          </section>
        </div>
      </AppLayout>
      <Footer />
    </>
  );
};
