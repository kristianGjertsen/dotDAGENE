import {
  BuildingOffice2Icon,
  MicrophoneIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
import { LinkButton } from '../components/LinkButton';
import {
  Banner,
  ContactForm,
  ContactUs,
  Countdown,
  Info,
  InfoWithButton,
} from '../components/HomePage';

export const HomePage = () => {
  return (
    <>
      <Header />
      <Banner />
      <Countdown />
      <section className="flex h-16 flex-row items-center justify-center"></section>
      {/* <section className="flex h-16 flex-col items-center justify-center gap-8 pt-2 sm:flex-row">
        <LinkButton link="/contact" color="green">
          Kontakt oss
        </LinkButton>
        <LinkButton link="/about" color="yellow">
          Les Mer
        </LinkButton>
      </section> */}
      <section>
        <section className="mt-16 flex flex-col items-center justify-center gap-2 px-8 sm:flex-row">
          <Info
            titelChildren="500+ STUDENTER"
            color="purple"
            icon={UserGroupIcon}
          >
            Møt kvalifiserte kandidater innen IT og teknologi
          </Info>
          <Info titelChildren="HELT NYTT" color="green" icon={SparklesIcon}>
            Første dotDAGENE noensinne - vær med fra starten!
          </Info>
        </section>
      </section>
      <section>
        <div className="mt-16 flex flex-col flex-wrap items-center gap-4">
          <h2 className="text-center text-4xl font-medium">
            OPPDAG MULIGHETENE
          </h2>
          <p className="text-center">
            dotDAGENE 2026 bringer sammen studenter og bedrifter gjennom en
            rekke aktiviteter og muligheter
          </p>
          <section className="mt-5 flex w-full flex-col items-stretch justify-center gap-2 px-8 sm:mt-16 sm:flex-row">
            <InfoWithButton
              titelChildren="STANDS"
              color="green"
              button={
                <LinkButton link="/contact" color="green">
                  Legg til i kalender
                </LinkButton>
              }
              icon={BuildingOffice2Icon}
            >
              Få egen stand på dotDAGENE og møt direkte med
              informatikkstudenter. Perfekt mulighet til å rekruttere de beste
              talentene innen digitalisering og teknologi.
            </InfoWithButton>
            <InfoWithButton
              titelChildren="PITCHEKVELD"
              color="yellow"
              button={
                <LinkButton link="/contact" color="green">
                  Legg til i kalender
                </LinkButton>
              }
              icon={MicrophoneIcon}
            >
              dotDAGENE inviterer til pitchekveld som avslutning på
              bedriftsdagen. Hver bedrift får 5-10 minutter til å presentere et
              spesifikt prosjekt eller teknologi - mer som en TedTalk enn en
              vanlig bedriftspresentasjon. Kvelden byr på konferansierer,
              drikkeservering og god stemning, etterfulgt av mingling med
              studentene.
            </InfoWithButton>
          </section>
        </div>
      </section>
      <section className="mx-16 my-32">
        <div className="flex w-full flex-col items-center justify-center gap-8 border-3 border-black bg-white p-8 text-center lg:p-32 lg:py-16">
          <h2 className="text-4xl font-medium md:text-6xl">HVEM ER VI?</h2>
          <p className="w-full md:px-48">
            NTNUs nyeste karrieredag innen digitalisering og teknologi.
            Arrangert av informatikkstudenter for å koble sammen fremtidens
            IT-talenter med bransjeledende bedrifter.
          </p>
        </div>
      </section>

      <section className="px-8">
        <section className="flex flex-col items-stretch justify-center gap-8 lg:flex-row">
          <ContactUs />
          <div className="bg-dotyellow flex w-full flex-col gap-4 border-3 border-black p-8">
            <h3 className="text-3xl">INTERESSEMELDING</h3>
            <p>
              Fyll ut skjemaet så tar vi kontakt for å diskutere
              standmuligheter.
            </p>
            <ContactForm />
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
};
