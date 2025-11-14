import { useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
import { LinkButton } from '../components/LinkButton';

const faqs = [
  {
    question: 'Hvem kan delta på dotDAGENE?',
    answer:
      'Arrangementet er åpent for alle studenter på NTNU. Bedrifter som ønsker å delta er også hjertelig velkomne til å melde interesse.',
  },
  {
    question: 'Må jeg melde meg på for å besøke standene?',
    answer:
      'Studentene trenger bare å møte opp på dagen. Bedrifter må booke stand på forhånd slik at vi kan sette opp riktig plassering og praktisk informasjon.',
  },
  {
    question: 'Hva skjer på pitchekvelden?',
    answer:
      'Etter standdagen inviteres bedriftene til korte sceneinnslag hvor de viser frem prosjekter, teknologi, kultur eller annet de ønsker. Kvelden avsluttes med mingling slik at studenter kan stille spørsmål i en uformell setting og bli mer kjent med bedriften.',
  },
  {
    question: 'Hvordan følger jeg med på viktige frister?',
    answer:
      'Vi sender ut informasjon på e-post til alle påmeldte bedrifter, og holder nettsiden oppdatert med praktiske detaljer. Legg gjerne arrangementet i kalenderen via forsiden.',
  },
];

const colorCycle = ['bg-dotpurple/70', 'bg-dotgreen/70', 'bg-dotyellow/70'];

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Header />
      <main className="px-8 py-16">
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.4em] text-gray-600">
              OFTE STILTE SPØRSMÅL
            </p>
            <h1 className="mt-4 text-4xl font-medium md:text-5xl">
              Alt du lurer på om karrieredagene
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Vi har samlet spørsmålene vi oftest får fra studenter og
              bedrifter. Ta gjerne kontakt dersom du ikke finner svaret.
            </p>
          </div>

        </section>

        <section className="mx-auto mt-16 grid max-w-5xl gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const backgroundColor = colorCycle[index % colorCycle.length];

            return (
              <article
                key={faq.question}
                className={`border-3 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] ${backgroundColor}`}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <h2 className="text-2xl font-semibold">{faq.question}</h2>
                  <span className="text-3xl font-bold text-black">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-6 pb-6 text-lg leading-relaxed text-black">
                    {faq.answer}
                  </p>
                )}
              </article>
            );
          })}
        </section>

        <section className="mx-auto mt-20 max-w-4xl text-center">
          <p className="text-xl font-medium">
            Fant du ikke svaret du trengte?
          </p>
          <p className="mt-3 text-gray-700 pb-10">
            Send oss en e-post eller meld interesse via kontaktskjemaet, så
            hjelper vi deg med alt fra praktiske spørsmål til samarbeid.
          </p>
          <LinkButton link="/#contact" color="green">
            Kontakt Oss
          </LinkButton>
        </section>
      </main>
      <Footer />
    </>
  );
};
