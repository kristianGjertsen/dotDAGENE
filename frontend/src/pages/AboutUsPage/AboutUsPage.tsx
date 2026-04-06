import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { LinkButton } from '../../components/Elements/LinkButton';
import GroupImg from '../../assets/groupImg.jpg';
import TeamSection from './TeamSection';

export const AboutUsPage = () => {
  return (
    <>
      <Header />
      <main className="bg-dotbackground">
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
                OM OSS
              </p>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Vi gir NTNU en helt ny karrieredag
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                dotDAGENE skapes av studenter for studenter og bedrifter. Vi bygger en møteplass
                der teknologi, kreativitet og ekte relasjoner står i sentrum.
              </p>

              <div className="relative">
                <div className="absolute left-4 top-4 h-full w-full bg-black/10" aria-hidden />
                <div className="relative border-3 border-black bg-secondary/70 p-6 shadow-[12px_12px_0_0_rgba(0,0,0,0.12)]">
                  <p className="text-sm tracking-[0.3em] text-gray-700 uppercase">
                    Studentene bak
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    Bachelor- og masterstudenter på informatikk
                  </h2>
                  <p className="mt-3 text-gray-800">
                    Vi representerer bachelor- og masterstudenter i informatikk ved NTNU.
                    Sammen legger vi til rette for samarbeid, læring og faglige muligheter.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-3 border-black bg-white p-6 shadow-[14px_14px_0_0_rgba(0,0,0,0.12)] space-y-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-gray-600">
                  TEAMET
                </p>
                <h2 className="text-3xl font-semibold">Menneskene bak dotDAGENE</h2>
                <p className="text-gray-700">
                  Et lite, dedikert team som kombinerer erfaring fra studentfrivillighet.
                  Vi planlegger, designer og gjennomfører karrieredagen sammen.
                </p>
              </div>
              <div className="overflow-hidden border-3 border-black bg-secondary/10">
                <img
                  src={GroupImg}
                  alt="Gruppebilde"
                  className="w-full h-[28rem] md:h-[32rem] object-cover object-[center_top]"
                />
              </div>
            </div>
          </div>
        </section>

        <TeamSection />

        <section className="mx-auto mt-24 mb-16 max-w-6xl px-4 text-center sm:px-8 lg:px-10">
          <div className="border-3 border-black bg-primary p-10 text-white shadow-[10px_10px_0_0_rgba(0,0,0,0.2)]">
            <h2 className="text-3xl font-semibold">Vil du samarbeide med oss?</h2>
            <p className="mt-4 text-lg pb-10">
              Vi er på jakt etter bedrifter og partnere som vil bidra
              til å forme dotDAGENE. Ta kontakt, så skreddersyr vi en opplevelse for dere.
            </p>
            <LinkButton link="/#contact" color="tertiary">
              Kontakt Oss
            </LinkButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
