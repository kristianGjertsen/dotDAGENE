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
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-start">

            <div className="space-y-6">
              
              <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
                OM OSS
              </p>
              <h1 className="text-4xl font-semibold md:text-5xl">
                Karrieredag skredder for IT-studenter
              </h1>
              
              <p className="text-left">
                dotDAGENE er karrieredager skreddersydd for studenter innen IT, teknologi og digitalisering. Vårt mål er enkelt: å skape reelle møteplasser der studenter og bedrifter kan ha gode, faglige samtaler som faktisk leder til muligheter.
              </p>
              <p className='text-left'>
                Vi skiller oss fra tradisjonelle karrieredager ved å prioritere kvalitet fremfor kvantitet. Der andre arrangementer ofte fyller lokalet med et stort antall stands, mange med begrenset relevans for IT-studenter, kuraterer vi et mer spisset utvalg av bedrifter. Resultatet er mindre støy og mer tid til innsikt, relasjonsbygging og konkrete karrieremuligheter.
              </p>
              <p className='text-left'>
                Hos oss møter du relevante arbeidsgivere som aktivt søker teknologikompetanse, og som er til stede for å snakke med deg, ikke bare samle CV-er. Dette gir bedre samtaler, mer treffsikre matcher og en mer verdifull opplevelse for alle parter.
                dotDAGENE er for deg som ønsker mer enn bare en rask introduksjon. Her legger vi til rette for ekte dialog mellom studenter og bransjen.
              </p>

              <p className='text-left'>
                dotDAGENE er for deg som ønsker mer enn bare en rask introduksjon. Her legger vi til rette for ekte dialog mellom studenter og bransjen.
              </p>


              <div className="relative mt-20">
                <div className="absolute left-4 top-4 h-full w-full" aria-hidden />
              </div>
            </div>

            <div className="border-3 border-black bg-white p-6 space-y-4">
              <div>
                <h2 className="text-3xl font-semibold">Menneskene bak dotDAGENE</h2>

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
