import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ContactForm } from './ContactForm';

export const ContactPage = () => {
  return (
    <>
      <Header />
      <AppLayout>
        <section className="px-6 py-16 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
              KONTAKT OSS
            </p>
            <h1 className="mt-4 text-4xl font-medium md:text-5xl">
              Meld interesse for dotDAGENE
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Fyll ut interesseskjemaet, så tar vi kontakt for å diskutere
              samarbeid, stand og muligheter for årets arrangement.
            </p>
          </div>

          <section className="mt-12">
            <div className="bg-tertiary mx-auto flex w-full max-w-4xl flex-col gap-4 border-3 border-black p-8 text-black">
              <h2 className="text-3xl">Interesseskjema</h2>
              <p>
                Fyll ut skjemaet så tar vi kontakt for å diskutere
                mulighetene.
              </p>
              <ContactForm />
            </div>
           
          </section>
        </section>
      </AppLayout>
      <Footer />
    </>
  );
};
