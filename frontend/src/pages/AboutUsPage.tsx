import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
import { LinkButton } from '../components/LinkButton';
//import TeamSection from '../components/AboutUsPage/TeamSection'
import FellesBilde from '../assets/FellesBilde.jpg';

/*
const values = [
  {
    title: 'STUDENTDREVET',
    description:
      'Planlagt og gjennomført av engasjerte informatikkstudenter som kjenner miljøet på NTNU.',
    color: 'bg-dotpurple',
  },
  {
    title: 'NYSKAPENDE',
    description:
      'Vi kombinerer stands med pitchekveld.',
    color: 'bg-dotgreen',
  },
  {
    title: 'TETT PÅ BRANSJEN',
    description:
      'Bedrifter møter relevante kandidater fra Informatikk og andre IT studier.',
    color: 'bg-dotyellow text-black',
  },
];
*/

/*
const timeline = [

  {
    year: '2024',
    title: 'Idden blir født',
    description:
      'Vi samlet et tverrfaglig team, bygget konseptet og fikk støtte fra NTNU og samarbeidspartnere.',
  },
  {
    year: '2025',
    title: 'Første pilot',
    description:
      'En intern pilot gav oss verdifulle tilbakemeldinger på alt fra logistikk til hvordan vi best matcher bedrifter med studenter.',
  },
  {
    year: '2026',
    title: 'dotDAGENE lanseres',
    description:
      'Vi åpner dørene for alle teknologistudenter på NTNU og inviterer bedrifter til å bli med på en helt ny møteplass.',
  },
];
*/

export const AboutUsPage = () => {
  return (
    <>
      <Header />
      <main className="bg-dotbackground">
        <section className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 sm:px-12 lg:flex-row lg:items-center lg:gap-20">
          <div className="space-y-6 text-center lg:text-left">
            <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
              OM OSS
            </p>
            <h1 className="text-4xl font-medium md:text-6xl">
              Vi gir NTNU en helt ny karrieredag
            </h1>
            <p className="text-lg text-gray-700">
              dotDAGENE er initiert av studenter som ønsker en møteplass hvor
              teknologi, kreativitet og reelle relasjoner står i sentrum. Vi
              setter rammene for gode samtaler og lar både studenter og bedrifter
              vise frem hvem de er utenfor klassiske stands.
            </p>
          </div>
          <div className="relative flex w-full justify-center lg:justify-end">
            <div className="border-3 border-black bg-white p-6 shadow-[-20px_-20px_0px_0px_rgba(0,0,0,0.15)]">
              <div className="flex flex-col gap-3 text-left">
                <p className="text-sm tracking-[0.3em] text-gray-500">
                  STUDENTENE BAK
                </p>
                <h2 className="text-3xl font-semibold">Linjeforeningen Online</h2>
                <p className="text-gray-700">
                  Vi representerer studenter innen informatikk, AI, datasikkerhet
                  og komplekse systemer. Sammen bygger vi rom for samarbeid,
                  læring og muligheter.
                </p>
              </div>
            </div>
          </div>
        </section>

        { /*
        <section className="mx-auto max-w-6xl px-6 sm:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className={`border-3 border-black p-6 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.15)] ${value.color}`}
              >
                <h3 className="text-2xl font-semibold">{value.title}</h3>
                <p className="mt-4 text-base leading-relaxed">{value.description}</p>
              </article>
            )) }
          </div>
        </section>
        */}

        { /*
        <section className="mx-auto mt-24 max-w-5xl px-6 sm:px-12">
          <div className="border-3 border-black bg-white p-8 text-center shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]">
            <h2 className="text-4xl font-medium">Reisen vår</h2>
            <p className="mx-auto mt-4 max-w-3xl text-gray-700">
              Vi bygger dotDAGENE stein for stein. Her er milepælene som har
              formet prosjektet og viser hvor vi er på vei.
            </p>
            <div className="mt-10 space-y-6">
              {timeline.map((item) => (
                <div
                  key={item.year}
                  className="flex flex-col gap-2 border-t border-gray-200 pt-6 text-left md:flex-row md:items-start md:gap-8"
                >
                  <div className="text-2xl font-semibold text-dotgreen">{item.year}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
*/}

        <section className="mx-auto mt-24 max-w-6xl px-6 sm:px-12">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
              TEAMET
            </p>
            <h2 className="mt-3 text-4xl font-medium">Menneskene bak dotDAGENE</h2>
            <p className="mt-4 text-gray-700">
              Vi er et lite, dedikert team som kombinerer erfaring fra studentfrivillighet.
            </p>
            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-5xl border-3 border-black bg-dotpurple/10 overflow-hidden">
                <img
                  src={FellesBilde}
                  alt="Gruppebilde"
                  className="h-120 w-full object-cover object-[center_70%]"
                />
              </div>
            </div>
          </div>
          {/* 
          <TeamSection />
          */}
        </section>

        <section className="mx-auto mt-24 mb-16 max-w-4xl px-6 text-center sm:px-12">
          <div className="border-3 border-black bg-dotgreen p-10 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl font-semibold">Vil du samarbeide med oss?</h2>
            <p className="mt-4 text-lg pb-10">
              Vi er på jakt etter bedrifter og partnere som vil bidra
              til å forme dotDAGENE. Ta kontakt vi skreddersyr en opplevelse for dere.
            </p>
            <LinkButton link="/#contact" color="yellow">
              Kontakt Oss
            </LinkButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
