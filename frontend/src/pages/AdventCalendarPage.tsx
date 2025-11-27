import dominosPizzaLogo from '../assets/dominosPizzaLogo.png';
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
};

const drops: Drop[] = [
  {
    id: 1,
    dateLabel: '30. november',
    title: 'Første søndag',
    description:
      'Premie: 5 DOMINOS PIZZAER til en heldig vinner!',
    status: 'active',
    image: dominosPizzaLogo,
  },
  {
    id: 2,
    dateLabel: '7. desember',
    title: 'Andre søndag',
    description: 'Slippes senere',
    status: 'upcoming',
  },
  {
    id: 3,
    dateLabel: '14. desember',
    title: 'Tredje søndag',
    description: 'Slippes senere',
    status: 'upcoming',
  },
  {
    id: 4,
    dateLabel: '21. desember',
    title: 'Fjerde søndag',
    description: 'Slippes senere',
    status: 'upcoming',
  },
];

//Endre denne linken til rktig post for hver uke
const instagramUrl = 'https://www.instagram.com/p/DRjrkF3F7K4/?img_index=1';
const dominosUrl = 'https://www.dominos.no/';

export const AdventCalendarPage = () => {
  const activeDrop = drops.find((drop) => drop.status === 'active') ?? drops[0];

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

        <section className="relative px-6 pb-16 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.6fr,1fr]">
            <div className="relative overflow-hidden border-3 border-black bg-white p-8 shadow-[12px_12px_0_0_rgba(0,0,0,0.16)]">
              <div className="absolute left-[-10px] top-0 rotate-[-6deg] border-2 border-black bg-red-600 px-4 py-1 text-sm font-bold text-white shadow-[3px_3px_0_rgba(0,0,0,0.25)]">
                {activeDrop.dateLabel}
              </div>

              <div className="flex items-center justify-between gap-4">
                <h2 className="text-4xl font-semibold text-red-700">
                  {activeDrop.title}
                </h2>
                <span className="flex items-center justify-center gap-2 border-2 border-green-700 bg-green-100 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-green-900 shadow-[4px_4px_0_rgba(0,0,0,0.12)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  Åpen nå
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <p className="text-3xl font-medium text-gray-900">
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
                    </a>{' '}
                    posten for å delta.
                  </span>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 sm:mt-4 sm:justify-start max-[450px]:flex-col max-[450px]:items-center max-[450px]:justify-center">
                    <LinkButton link={instagramUrl} color="red" size="lg">
                      Instagram
                    </LinkButton>

                    {activeDrop.image && (
                      <LinkButton
                        link={dominosUrl}
                        color="white"
                        size="sm"
                        className="sm:ml-auto"
                      >
                        <img
                          src={activeDrop.image}
                          alt={activeDrop.title}
                          className="h-30 w-auto object-cover"
                        />
                      </LinkButton>
                    )}
                  </div>
                </div>
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
                      <div className="w-full overflow-hidden border-3 border-black shadow-[6px_6px_0_rgba(0,0,0,0.12)] sm:w-52">
                        <img
                          src={drop.image}
                          alt={drop.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
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
