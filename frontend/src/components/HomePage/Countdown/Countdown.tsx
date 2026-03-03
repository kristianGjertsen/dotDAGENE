export const Countdown = () => {
  return (
    <section className="flex flex-col items-center gap-6 px-4">
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-dotgreen flex h-24 w-24 flex-col items-center justify-center border-3 border-black text-white sm:h-28 sm:w-28 md:h-30 md:w-30 mx-auto">
          <p className="text-3xl font-bold sm:text-4xl">0</p>
          <p>DAGER</p>
        </div>
        <div className="bg-dotpurple flex h-24 w-24 flex-col items-center justify-center border-3 border-black text-white sm:h-28 sm:w-28 md:h-30 md:w-30 mx-auto">
          <p className="text-3xl font-bold sm:text-4xl">0</p>
          <p>TIMER</p>
        </div>
        <div className="bg-dotyellow flex h-24 w-24 flex-col items-center justify-center border-3 border-black text-white sm:h-28 sm:w-28 md:h-30 md:w-30 mx-auto">
          <p className="text-3xl font-bold sm:text-4xl">0</p>
          <p>MINUTTER</p>
        </div>
        <div className="bg-dotgreen flex h-24 w-24 flex-col items-center justify-center border-3 border-black text-white sm:h-28 sm:w-28 md:h-30 md:w-30 mx-auto">
          <p className="text-3xl font-bold sm:text-4xl">0</p>
          <p>SEKUNDER</p>
        </div>
      </div>
      <div>
        3. mars 2026 ·&nbsp;
        <a
          href="https://link.mazemap.com/aev0cjsq"
          className="font-medium underline"
          target="_blank"
        >
          Realfagbygget U1, Gløshaugen
        </a>
      </div>
    </section>
  );
};
