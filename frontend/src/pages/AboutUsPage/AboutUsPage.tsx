import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { LinkButton } from '../../components/Elements/LinkButton';
import GroupImg from '../../assets/groupImg.jpg';
//import TeamSection from './TeamSection';
import { AppLayout } from '../../components/Layout/AppLayout';
import { InfoWithButton } from '../../components/Elements/InfoWithButton';
import { Info } from '../../components/Elements/Info';

export const AboutUsPage = () => {
  return (
    <>
      <Header />
      <AppLayout>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-5xl xl:max-w-none">
            <h1 className="mb-8 text-center text-4xl md:text-5xl">
              Om dotDAGENE
            </h1>

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1.15fr_1fr] xl:gap-12 xl:items-start">
              <div className="contents xl:block xl:space-y-6">
                <Info
                  titelChildren=""
                  color="white"
                  backImg="white"
                  className="!h-auto !flex-none !basis-auto xl:mr-28"
                >
                  <p className="text-left">
                    dotDAGENE er karrieredager skreddersydd for studenter innen IT,
                    teknologi og digitalisering. Målet vårt er å skape reelle møteplasser
                    der studenter og bedrifter kan ha gode faglige samtaler som leder
                    til muligheter. Vi skiller oss fra tradisjonelle karrieredager ved å
                    prioritere kvalitet fremfor kvantitet, med et mer spisset utvalg av relevante bedrifter.
                  </p>
                </Info>

                <Info
                  titelChildren=""
                  color="white"
                  backImg="white"
                  className="!h-auto !flex-none !basis-auto xl:ml-28"
                >
                  <p className="text-left">
                    Resultatet er mindre støy og mer tid til innsikt,
                    relasjoner og konkrete karrieremuligheter.
                    Hos oss møter du arbeidsgivere som aktivt søker
                    teknologikompetanse og ønsker gode samtaler, ikke bare CV-er.
                    dotDAGENE er for deg som vil mer enn en rask introduksjon,
                    med ekte dialog mellom studenter og bransjen.
                  </p>
                </Info>
              </div>

              <div className="contents xl:block xl:ml-6">
                <Info
                  titelChildren="Menneskene bak dotDAGENE"
                  color="primary"
                  backImg="green"
                  className="!h-auto !flex-none !basis-auto"
                >
                  Vi representerer bachelor- og masterstudenter i informatikk ved NTNU.
                  Sammen legger vi til rette for samarbeid, læring og faglige muligheter.
                </Info>

                <img
                  src={GroupImg}
                  alt="Gruppebilde"
                  className="h-auto w-full border-2 border-black xl:mt-5"
                />
              </div>
            </div>
          </div>
        </section>



        <section className="mx-auto mt-24 mb-16 max-w-6xl px-4 text-center sm:px-8 lg:px-10">

          <InfoWithButton
            titelChildren="Vil du samarbeide med oss?"
            color="primary"
            backImg="green"
            button={<LinkButton link="/kontakt" color="white">
              Kontakt Oss
            </LinkButton>}

          >
            Vi er på jakt etter bedrifter og partnere som vil bidra
            til å forme dotDAGENE. Ta kontakt, så skreddersyr vi en opplevelse for dere.

          </InfoWithButton>

        </section>
      </AppLayout >
      <Footer />
    </>
  );
};
