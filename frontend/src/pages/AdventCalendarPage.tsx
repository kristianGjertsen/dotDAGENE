import { Footer } from '../components/Footer';
import { Header } from '../components/Header/Header';
export const AdventCalendarPage = () => {
  return (
    <>
      <Header />
      <main className="bg-dotbackground min-h-screen">
        <section className="px-6 py-16 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl border-3 border-black bg-white p-10 text-center shadow-[12px_12px_0_0_rgba(0,0,0,0.15)]">
            <p className="text-sm font-semibold tracking-[0.35em] text-red-600">
              ADVENTSKALENDER
            </p>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl text-red-700">
              Adventskalender blir straks annonsert
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Følg med, mer info kommer veldig snart.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
