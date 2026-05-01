import { AppLayout } from '../../components/Layout/AppLayout';
import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { CompLayout } from './ParticipatingCompanies/CompLayout';
import StandMap from './StandMap/StandMap';

export const PreviousDotdagenePage = () => {
  return (
    <>
      <Header />
      <AppLayout>
        <section className="px-6 pt-20 pb-28 sm:px-12 lg:px-20">
          <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
                FORRIGE DOTDAGENE
              </p>
              <h1 className="mt-4 text-4xl font-medium md:text-5xl">
                Et tilbakeblikk på forrige arrangement
              </h1>
              
            </div>
          </section>

          <div className="mx-auto mt-20 flex max-w-5xl flex-col gap-20">
            <div className="mx-auto w-full max-w-[600px]">
              <StandMap
                title="Standkart fra arrangementet"
                description="Hover eller trykk på standene for å se hvilke bedrifter som stod hvor."
              />
            </div>

            <div>
              <CompLayout/>
            </div>
          </div>
        </section>
      </AppLayout>
      <Footer />
    </>
  );
};
