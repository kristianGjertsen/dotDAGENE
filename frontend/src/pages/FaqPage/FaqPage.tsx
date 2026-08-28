import { useState } from 'react';
import { Footer } from '../../components/PageSections/Footer/Footer';
import { Header } from '../../components/PageSections/Header/Header';
import { LinkButton } from '../../components/Elements/LinkButton';
import { ToggleSlider } from '../../components/Elements/ToggleSlider';
import {
  contactLinkClasses,
  faqsForCompanies,
  faqsForStudents,
} from './FaqQuestions';
import { AppLayout } from '../../components/Layout/AppLayout';
import { backgroundPatternOpacity } from '../../lib/backgroundPattern';
import backtemp from '../../assets/backgroundInv.svg';

// Alternerende farger, tonet ned
const colorCycle = ['bg-white'];

const getAlternatingBackImageRotation = (index: number) => {
  return index % 2 === 0 ? '' : 'rotate-180';
};

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
      <AppLayout>
        <section className="px-8 py-16">
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

            <p className="mt-2 pt-5 font-semibold tracking-[0.2em] text-gray-700 uppercase">
              Velg målgruppe
            </p>

            <ToggleSlider
              ariaLabel="Velg målgruppe"
              value={audience}
              onChange={(nextAudience) => {
                setAudience(nextAudience);
                setOpenIndex(null);
              }}
              options={[
                { value: 'student', label: 'For studenter' },
                { value: 'bedrift', label: 'For bedrifter' },
              ]}
            />
          </section>

          <section className="mx-auto mt-12 grid max-w-5xl gap-4">
            {visibleFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const backgroundColor = colorCycle[index % colorCycle.length];
              const backImageRotation = getAlternatingBackImageRotation(index);

              return (
                <article
                  key={faq.question}
                  className={`relative overflow-hidden border-3 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] ${backgroundColor}`}
                >
                  <div
                    className={`absolute top-0 left-0 h-[260px] w-full bg-cover bg-top ${backImageRotation}`}
                    style={{
                      backgroundImage: `url(${backtemp})`,
                      opacity: backgroundPatternOpacity.faq,
                    }}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => toggleQuestion(index)}
                    className="relative z-10 flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <h2 className="text-2xl font-semibold">{faq.question}</h2>
                    <span
                      className={`text-3xl font-bold text-black transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`relative z-10 grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-lg leading-relaxed text-black">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mx-auto mt-20 max-w-4xl text-center">
            <p className="text-xl font-medium">
              Fant du ikke svaret du trengte?
            </p>
            <p className="mt-3 pb-10 text-gray-700">
              Send oss en e-post eller meld interesse via{' '}
              <a href="/kontakt" className={contactLinkClasses}>
                interesseskjemaet
              </a>
              , så hjelper vi deg med alt fra praktiske spørsmål til samarbeid.
            </p>
            <LinkButton link="/kontakt" color="primary" size="xl">
              Kontakt Oss
            </LinkButton>
          </section>
        </section>
      </AppLayout>
      <Footer />
    </>
  );
};
