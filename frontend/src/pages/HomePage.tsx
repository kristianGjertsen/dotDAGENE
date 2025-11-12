import {
  BuildingOffice2Icon,
  MicrophoneIcon,
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
  return (
    <>
      <Header />
      <div className="block md:hidden">
        <BannerSmall />
      </div>

      {/* Vises kun på store skjermer */}
      <div className="hidden md:block">
        <BannerBig />
      </div>


      <Countdown />

      <section className="mt-16 px-8">
        <section className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch">
          <Info
            titelChildren="500+ STUDENTER"
            color="purple"
            icon={UserGroupIcon}
          >
            Velkommen til årets møteplass for morgendagens teknologer! Karrieredagen samler over 500 studenter fra informatikk og relaterte studieretninger.
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

      <section>
        <div className="mt-16 flex flex-col flex-wrap items-center gap-4">
          <div className='px-8'>

            <h2 className="text-center text-4xl font-medium">
              OPPDAG MULIGHETENE
            </h2>
            <p className="mt-5 text-center">
              dotDAGENE 2026 bringer sammen studenter og bedrifter.
              Her får du sjansen til å bygge nettverk, utforske fremtidige karriereveier og oppleve hvordan teknologi og samarbeid skaper nye muligheter.
              Enten du kommer for å møte potensielle arbeidsgivere, vise frem bedriften din, eller bare bli inspirert, er dotDAGENE stedet der nye ideer og kontakter oppstår
            </p>
          </div>

          <section className="mt-20 flex w-full flex-col items-stretch justify-center gap-x-4 gap-y-10 px-8 sm:mt-20 sm:flex-row">
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

            <InfoWithButton
              titelChildren="PITCHEKVELD"
              color="yellow"
              textColor="black"
              button={<CalendarButton color="purple" />}
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
          <div className="bg-dotyellow flex w-full flex-col gap-4 border-3 border-black p-8">
            <h3 className="text-3xl pl-8">INTERESSEMELDING</h3>
            <p className='pl-8'>
              Fyll ut skjemaet så tar vi kontakt for å diskutere
              standmuligheter.
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
