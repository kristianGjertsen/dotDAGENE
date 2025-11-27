import { useState } from 'react';
import { Footer } from '../components/PageSections/Footer';
import { Header } from '../components/PageSections/Header';
import { LinkButton } from '../components/Elements/LinkButton';
import {
  contactLinkClasses,
  faqsForCompanies,
  faqsForStudents,
} from '../components/Faq/FaqQuestions';

//Alternerende farger, tonet ned 
const colorCycle = ['bg-dotpurple/80', 'bg-dotgreen/80', 'bg-dotyellow/80'];

// Togle knapp felles-stil
const baseToggleButtonClasses = 'relative z-10 flex-1 px-6 py-2 text-base font-semibold cursor-pointer transition-colors duration-300 sm:px-8 sm:py-2 sm:text-lg';

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
          {/* Toggle knapp for student / bedrift */}
          <div className="mt-4 inline-flex w-full max-w-md items-stretch overflow-hidden border-3 border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.15)] relative">
            <span
              aria-hidden="true"
              className={`absolute inset-y-0 left-0 w-1/2 bg-dotgreen transition-transform duration-300 ${audience === 'bedrift' ? 'translate-x-full' : ''
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

        {/* FAQ seksjon */}
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
