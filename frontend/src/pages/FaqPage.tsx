import { useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
import { LinkButton } from '../components/LinkButton';

const contactLinkClasses =
  'underline decoration-2 decoration-black underline-offset-4 hover:text-dotgreen hover:decoration-dotgreen transition-colors duration-150';

const faqsForCompanies = [
  {
    question: 'Hvem kan delta som bedrift på dotDAGENE?',
    answer:
      'dotDAGENE er åpent for bedrifter innen IT, teknologi og digitalisering som ønsker å møte studenter ved NTNU. Ta kontakt via interesseskjemaet for mer informasjon.',
  },
  {
    question: 'Hvordan booker vi stand?',
    answer: (
      <>
        Bedrifter må melde interesse via{' '}
        <a href="/#contact" className={contactLinkClasses}>
          interesseskjemaet
        </a>{' '}
        eller e-post. Vi følger opp med praktisk informasjon, standplassering
        og avtale om videre samarbeid.
      </>
    ),
  },
  {
    question: 'Hva skjer på pitchekvelden for bedrifter?',
    answer:
      'Etter standdagen inviteres bedriftene til korte sceneinnslag hvor dere kan vise frem prosjekter, teknologi eller kultur. Kvelden avsluttes med mingling med studentene i en mer uformell setting.',
  },
  {
    question: 'Hvordan får vi beskjed om viktige frister?',
    answer:
      'Vi sender ut informasjon på e-post til alle påmeldte bedrifter, og holder nettsiden oppdatert med praktiske detaljer og frister.',
  },
  {
    question: 'Hvor mye koster det å delta som bedrift?',
    answer: (
      <>
        Pris og pakker tilpasses størrelsen på bedriften og hvordan dere ønsker
        å delta. Ta kontakt med oss via{' '}
        <a href="/#contact" className={contactLinkClasses}>
          interesseskjemaet
        </a>
        , så finner vi en løsning som passer dere.
      </>
    ),
  },
];

const faqsForStudents = [
  {
    question: 'Hvem kan delta som student på dotDAGENE?',
    answer:
      'Arrangementet er åpent for alle studenter ved NTNU som er nysgjerrige på IT, teknologi og digitalisering.',
  },
  {
    question: 'Må jeg melde meg på for å besøke standene?',
    answer:
      'Nei, som student trenger du bare å møte opp på dagen. Det er gratis å delta, og du kan gå inn og ut av arrangementet som du vil.',
  },
  {
    question: 'Hva får jeg ut av å komme på pitchekvelden?',
    answer:
      'På pitchekvelden får du korte presentasjoner fra bedrifter om ekte prosjekter, teknologi og muligheter. Etterpå blir det mingling hvor du kan stille spørsmål og bygge nettverk.',
  },
  {
    question: 'Hvordan holder jeg meg oppdatert som student?',
    answer:
      'Følg med på nettsiden og våre kanaler for oppdateringer. Vi legger også ut viktig informasjon via linjeforeningene og relevante grupper.',
  },
];

//Alternerende farger, tonet ned 
const colorCycle = ['bg-dotpurple/80', 'bg-dotgreen/80', 'bg-dotyellow/80'];

// Togle knapp felles-stil (uten individuelle bakgrunner)
const baseToggleButtonClasses =
  'relative z-10 flex-1 px-10 text-lg font-bold cursor-pointer transition-colors duration-700 sm:px-8 sm:py-2 sm:text-lg';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [audience, setAudience] = useState<'bedrift' | 'student'>('student');

  const visibleFaqs =
    audience === 'bedrift' ? faqsForCompanies : faqsForStudents;

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
          {/* Knapp for student / Bedrift */}
          <p className="mt-2 pt-5  font-semibold uppercase tracking-[0.2em] text-gray-700">
            Velg målgruppe
          </p>
          <div className="mt-4 inline-flex w-full max-w-md items-stretch overflow-hidden border-3 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1/2 bg-dotgreen transition-transform duration-500 ${audience === 'bedrift' ? 'translate-x-full' : ''
                }`}
            />
            <button
              type="button"
              onClick={() => {
                setAudience('student');
                setOpenIndex(null);
              }}
              className={`${baseToggleButtonClasses} ${audience === 'student'
                ? 'text-white'
                : 'text-black hover:text-black/80'
                }`}
            >
              For studenter
            </button>
            <button
              type="button"
              onClick={() => {
                setAudience('bedrift');
                setOpenIndex(null);
              }}
              className={`border-l-3 border-black ${baseToggleButtonClasses} ${audience === 'bedrift'
                ? 'text-white'
                : 'text-black hover:text-black/80'
                }`}
            >
              For bedrifter
            </button>
          </div>
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-4">
          {visibleFaqs.map((faq, index) => {
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
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer"
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
            Send oss en e-post eller meld interesse via{' '}
            <a href="/#contact" className={contactLinkClasses}>
              interesseskjemaet
            </a>
            , så hjelper vi deg med alt fra praktiske spørsmål til samarbeid.
          </p>
          <LinkButton link="/#contact" color="green" size="xl">
            Kontakt Oss
          </LinkButton>
        </section>
      </main>
      <Footer />
    </>
  );
};
