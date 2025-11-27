import type { ReactNode } from 'react';

const contactLinkClasses =
  'underline decoration-2 decoration-black underline-offset-4 hover:text-dotgreen hover:decoration-dotgreen transition-colors duration-150';

type FaqItem = {
  question: string;
  answer: ReactNode;
};

//FAQ-innhold for studenter og bedrifter
export const faqsForStudents: FaqItem[] = [
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
    question: 'Hvordan holder jeg meg oppdatert som student?',
    answer:
      'Følg med på nettsiden og våre kanaler for oppdateringer. Vi legger også ut viktig informasjon via linjeforeningene og relevante grupper.',
  },
];
//FAQ-innhold for bedrifter
export const faqsForCompanies: FaqItem[] = [
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

export { contactLinkClasses };
