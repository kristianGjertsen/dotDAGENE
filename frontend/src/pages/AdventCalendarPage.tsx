import dominosPizzaLogo from '../assets/dominosPizzaLogo.png';
import wabbaLogo from '../assets/wabbaLogo.webp';
import lostacosAndSitLogo from '../assets/los_sit.png';
import egonLogo from '../assets/egonLogo.png';

//import { useState } from 'react';
//import type { FormEvent } from 'react';
import { Footer } from '../components/PageSections/Footer';
import { Header } from '../components/PageSections/Header';
import { LinkButton } from '../components/Elements/LinkButton';

type Drop = {
  id: number;
  dateLabel: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'done';
  image?: string;
  url?: string;
};

//Liste med alle drops i kalenderen, endre active og info for å bytte
const drops: Drop[] = [
  {
    id: 1,
    dateLabel: '30. november',
    title: 'Første søndag',
    description:
      'Premie: 5 DOMINOS PIZZAER til en heldig vinner!',
    status: 'done',
    image: dominosPizzaLogo,
    url: 'https://www.dominos.no/',
  },
  {
    id: 2,
    dateLabel: '7. desember',
    title: 'Andre søndag',
    description: '4 vinnere av gavepakke fra Wabba! Riktig sang var Stjernesludd',
    status: 'done',
    image: wabbaLogo,
    url: 'https://www.wabba.no/'
  },
  {
    id: 3,
    dateLabel: '14. desember',
    title: 'Tredje søndag',
    description:
      '1. premie er gavekort på 500 kr hos Los Tacos \n\n2. premie er gavekort på 100 kr hos Sit',
    image: lostacosAndSitLogo,
    url: 'https://lostacos.no/',
    status: 'done',
  },
  {
    id: 4,
    dateLabel: '21. desember',
    title: 'Fjerde søndag',
    description: 'Gavekort på Egon Solsiden* med middag for 2 stk \n+ 2 gavekort på 100kr hos Sit to andre heldige vinnere!',
    image: egonLogo,
    url: 'https://egon.no/restauranter/troendelag/egon-solsiden',
    status: 'active',
  },
];

//Endre denne linken til rktig post for hver uke
const instagramUrl = 'https://www.instagram.com/dotdagene/';

export const AdventCalendarPage = () => {
  const activeDrop = drops.find((drop) => drop.status === 'active') ?? drops[0];

  /*
  const [name, setName] = useState('');
  const [answer, setAnswer] = useState('');
  
 const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
   const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedAnswer = answer.trim();

    
    if (!trimmedName || !trimmedAnswer) {
      setFeedbackMessage('Fyll inn både navn og sangtittel.');
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');
    setFeedbackMessage(null);

    try {
      const response = await fetch('/api/contest-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, answer: trimmedAnswer }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Kunne ikke lagre svaret.');
      }

      setSubmitStatus('success');
      setFeedbackMessage('Takk! Svaret er registrert 🎄');
      setName('');
      setAnswer('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Noe gikk galt. Prøv igjen.';
      setSubmitStatus('error');
      setFeedbackMessage(message);
    }
  };
  */

  const statusRank: Record<Drop['status'], number> = {
    active: 0,
    upcoming: 1,
    done: 2,
  };

  const otherDrops = drops
    .filter((drop) => drop.id !== activeDrop.id)
    .sort((a, b) => statusRank[a.status] - statusRank[b.status]);

  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col bg-red-200">
        <div className="pointer-events-none absolute inset-0 " />

        <section className="relative px-6 py-14 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-5xl border-3 border-black bg-white/90 p-10 text-center shadow-[12px_12px_0_0_rgba(0,0,0,0.15)] backdrop-blur">
            <p className="text-sm font-semibold tracking-[0.35em] text-red-600">
              ADVENTSKALENDER
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-red-700 md:text-5xl">
              En premie hver søndag i desember
            </h1>
            <p className="mt-4 text-lg text-gray-800">
              Bli med på dotDAGENE adventskalender 2025! Hver søndag i desember
            </p>
          </div>
        </section>

        <section className="relative px-6 pb-8 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.6fr,1fr]">
            <div className="relative overflow-hidden border-3 border-black bg-white p-4 shadow-[12px_12px_0_0_rgba(0,0,0,0.16)]">
              <div className="absolute left-[-10px] top-0 rotate-[-6deg] border-2 border-black bg-red-600 px-3 py-0.5 text-xs font-bold text-white shadow-[3px_3px_0_rgba(0,0,0,0.25)]">
                {activeDrop.dateLabel}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-semibold text-red-700">
                  {activeDrop.title}
                </h2>
                <span className="flex items-center justify-center gap-2 border-2 border-green-700 bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-green-900 shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
                  <span className="h-2.5 w-2.5  rounded-full  bg-green-600" />
                  Åpen
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex-1">
                  <p className="text-2xl font-medium text-gray-900 whitespace-pre-line">
                    {activeDrop.description}
                  </p>
                  <span className="mt-2 block text-sm font-medium text-red-800 sm:mt-3">
                    Følg instruksjonene på{' '}
                    <a
                      className="underline decoration-2 decoration-red-600 underline-offset-2 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      denne
                    </a>
                    {' ' /* Må ha med for mellomrom mellom ordene*/}
                    posten på Instagram for å delta!
                  </span>

                  <div className="mt-3 flex flex-col pt-2 items-center gap-3 sm:mt-4">
                    <div className="flex w-full justify-start">
                      <LinkButton link={instagramUrl} color="red" size="lg">
                        Instagram
                      </LinkButton>
                    </div>
                  </div>
                </div>

                {activeDrop.image && (
                  <div className="mt-4 flex w-full justify-center lg:mt-0 lg:w-auto lg:pl-4">
                    <a
                      href={activeDrop.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full max-w-md border-3 border-black bg-white px-4 py-3 shadow-[10px_10px_0_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <img
                        src={activeDrop.image}
                        alt={activeDrop.title}
                        className="h-auto w-full object-contain"
                      />
                    </a>
                  </div>
                )}

                {/* <form
                  className="w-full max-w-sm self-center border-3 border-black bg-amber-50 px-6 py-6 text-left shadow-[8px_8px_0_rgba(0,0,0,0.16)] lg:ml-auto lg:self-start"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-amber-700">
                    Ukens konkurranse
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-red-700">
                    Gjett sangtittelen
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">
                    Hvilken norsk sang blir dette?
                    <br />
                    Tips: DumDum Boys
                  </p>

                  <div className="mt-4 border-2 border-dashed border-red-300 bg-black/10 px-5 py-4 text-center text-4xl font-semibold text-gray-900">
                    🌙❄🌨️👼👥⬆☁
                  </div>

                  <div className="mt-5 space-y-4 text-sm font-medium text-gray-800">
                    <div className="space-y-2">
                      <label
                        className="block text-xs font-bold uppercase tracking-wide"
                        htmlFor="contest-name"
                      >
                        Navn
                      </label>
                      <input
                        id="contest-name"
                        type="text"
                        placeholder="Ditt navn"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="w-full border-2 border-black bg-white px-4 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        className="block text-xs font-bold uppercase tracking-wide"
                        htmlFor="contest-answer"
                      >
                        Hva er tittelen på sangen?
                      </label>
                      <input
                        id="contest-answer"
                        type="text"
                        placeholder="Skriv tittelen her"
                        value={answer}
                        onChange={(event) => setAnswer(event.target.value)}
                        className="w-full border-2 border-black bg-white px-4 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="inline-flex w-full items-center justify-center border-2 border-black bg-red-600 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitStatus === 'loading' ? 'Sender...' : 'Send inn'}
                    </button>
                    <p className="text-xs text-gray-600">
                      Vi kontakter vinneren via Instagram etter at fristen er ute.
                    </p>
                    {feedbackMessage && (
                      <p
                        className={`text-xs font-semibold ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                          }`}
                      >
                        {feedbackMessage}
                      </p>
                    )}
                  </div>
                </form>*/}
              </div>
            </div>

          </div>
        </section>

        <section className="relative px-6 pb-24 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl">
            <h3 className="text-3xl font-semibold text-red-700">Andre søndager</h3>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {otherDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="relative overflow-hidden border-3 border-black bg-white p-6 shadow-[10px_10px_0_0_rgba(0,0,0,0.18)]"
                >
                  <div className="absolute left-[-10px] top-0 rotate-[-6deg] border-2 border-black bg-gray-200 px-4 py-1 text-sm font-bold text-gray-800 shadow-[3px_3px_0_rgba(0,0,0,0.25)]">
                    {drop.dateLabel}
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold text-red-700">
                      {drop.title}
                    </h4>
                    <span
                      className={`flex items-center justify-center gap-2 border-2 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-[3px_3px_0_rgba(0,0,0,0.12)] ${drop.status === 'done'
                        ? 'border-green-700 bg-green-100 text-green-900'
                        : 'border-amber-700 bg-amber-100 text-amber-900'
                        }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${drop.status === 'done' ? 'bg-green-600' : 'bg-amber-500'
                          }`}
                      />
                      {drop.status === 'done' ? 'Ferdig' : 'Slippes senere'}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-900">
                        {drop.description}
                      </p>
                    </div>

                    {drop.image && (
                      <a
                        href={drop.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-32 mx-auto overflow-hidden border-3 border-black shadow-[6px_6px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:w-32"
                      >
                        <img
                          src={drop.image}
                          alt={drop.title}
                          className="h-auto w-full object-contain"
                        />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="mt-auto">
          <Footer />
        </div>
      </main>
    </>
  );
};
