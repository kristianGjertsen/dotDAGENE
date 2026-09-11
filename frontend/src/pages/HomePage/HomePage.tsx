import { useEffect, useRef } from 'react';
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
import { CalendarButton, Countdown } from '.';
import { AppLayout } from '../../components/Layout/AppLayout';
import StandMap from './StandMap/StandMap';

import DropletHero from './droplets';

export const HomePage = () => {
  const location = useLocation();
  const heroRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const header = headerRef.current;
    if (!hero || !header) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const updateHeader = () => {
      frame = 0;
      // Fade in as the last part of the hero leaves the viewport.
      const fadeStart = window.innerHeight * 0.6;
      const fadeEnd = header.offsetHeight;
      const progress = Math.max(0, Math.min(1,
        (fadeStart - hero.getBoundingClientRect().bottom) / Math.max(1, fadeStart - fadeEnd),
      ));
      const opacity = reducedMotion.matches ? Number(progress > 0) : progress;
      header.style.opacity = String(opacity);
      header.style.visibility = opacity > 0 ? 'visible' : 'hidden';
      header.inert = opacity === 0;
      hero.style.opacity = String(1 - opacity);
      hero.inert = opacity === 1;
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(hero);
    observer.observe(header);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    reducedMotion.addEventListener('change', scheduleUpdate);
    updateHeader();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', scheduleUpdate);
    };
  }, []);

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
      <div
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-40"
        style={{ opacity: 0, visibility: 'hidden' }}
      >
        <Header />
      </div>
      <AppLayout>
        {/* H1 For at google/bing skal kunne lese overskrift, ikke synelig*/}
        <h1 className="sr-only">dotDAGENE 2025</h1>

        <div ref={heroRef} className="w-screen self-center">
          <DropletHero scrollTarget="innhold" />
        </div>
        <Countdown />
        <section className="px-6 py-20 sm:px-12 lg:px-20">
          <InfoWithButton
            titelChildren="Vi gjentar suksessen fra i fjor"
            color="white"
            backImg="white"
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
        </section>
        <section className="px-6 py-20 sm:px-12 lg:px-20">
          <section className="flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 sm:flex-row">
            <div className="flex w-full sm:w-1/2">
              <InfoWithButton
                titelChildren="Flere hundre studenter"
                color="white"
                backImg="white"
                button={null}
                icon={UserGroupIcon}
              >
                Velkommen til neste års møteplass for morgendagens teknologer!
                Karrieredagene samler flere hundre studenter fra informatikk og
                relaterte studieretninger.
              </InfoWithButton>
            </div>

            <div className="flex w-full sm:w-1/2">
              <InfoWithButton
                titelChildren="Forrige dotDAGENE"
                color="primary"
                backImg="green"
                icon={ClockIcon}
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
            <div className="mx-auto max-w-5xl">
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
              <div className="flex w-full">
                <InfoWithButton
                  titelChildren="Stands"
                  color="primary"
                  backImg="green"
                  button={<CalendarButton color="white" />}
                  icon={BuildingOffice2Icon}
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

              <StandMap
                title="Standkart for dotDAGENE 2027"
                description="Hover eller trykk på standene for å se hvem som står hvor."
              />

              <div className="flex w-full">
                <Info
                  titelChildren="Kveldsarrangement"
                  color="white"
                  backImg="white"
                  icon={SparklesIcon}
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
      </AppLayout>
      <Footer />
    </>
  );
};
