export const AboutUsPage = () => {
  return (
    <div className="relative flex flex-col content-between items-center justify-center gap-12">
      <h1 className="self-start pl-5 text-6xl md:self-center md:p-0 md:text-center">
        Hvem er <br />
        <b>vi?</b>
      </h1>
      <section className="bg-dotpastelgreen relative h-70 w-xs p-4 text-center text-4xl font-medium text-white shadow-[-20px_-20px_0px_0px_rgba(80,80,80,1)]">
        Bildet av oss
      </section>
      <p className="mb-30 w-xs text-base md:w-xl md:text-2xl">
        Vi er en gruppe engasjerte studenter fra Linjeforeningen Online Lorem
        ipsum dolor sit amet, consectetur adipiscing elit. Fusce non quam quis
        quam vestibulum lobortis eu non est. Sed a scelerisque enim, nec
        vestibulum augue.
      </p>
    </div>
  );
};
