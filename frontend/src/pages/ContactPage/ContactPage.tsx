import { useMemo } from 'react';
import { Footer } from '../../components/PageSections/Footer';
import { Header } from '../../components/PageSections/Header';
import { AppLayout } from '../../components/Layout/AppLayout';
import { ContactForm } from './ContactForm';
import backImg from '../../assets/backgroundInv.svg';

const getRandomBackImageRotation = () => {
  return Math.random() < 0.5 ? 'rotate-180' : '';
};

export const ContactPage = () => {
  const backImageRotation = useMemo(() => getRandomBackImageRotation(), []);

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
              samarbeid, stand og muligheter for neste års arrangement.
            </p>
          </div>

          <section className="mt-12">
            <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-4 overflow-hidden border-3 border-black bg-primary p-8 text-white">
              <div
                className={`absolute inset-0 bg-cover bg-center opacity-[0.07] ${backImageRotation}`}
                style={{ backgroundImage: `url(${backImg})` }}
                aria-hidden="true"
              />

              <div className="relative z-10 text-center">
                <h2 className="text-3xl">Interesseskjema</h2>
                <p className="mt-2">
                  Fyll ut skjemaet så tar vi kontakt for å diskutere
                  mulighetene.
                </p>
              </div>

              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>
          </section>
        </section>
      </AppLayout>
      <Footer />
    </>
  );
};
