import { LinkButton } from '../Elements/LinkButton';

export const AcceptedHeader = () => {
  return (
    <section className="mt-3  sm:px-12 lg:px-20">
      <LinkButton
        link="https://docs.google.com/forms/d/e/1FAIpQLSfo9P_BPwMqjtNFGPCzuVEVP1zgqmJLON4vS7IZODYrFjD0cw/viewform"
        color="yellow"
        size="xl"
        className="!block w-full"
      >
        <span className="block text-2xl font-bold">
          dotDAGENE har opptak!
        </span>
        <span className=" block text-lg font-semibold">
          Klikk her for å lese mere og meld interesse
        </span>
        <span className=" block text-xs font-medium">
          *Kun for informatikk studenter ved NTNU
        </span>
      </LinkButton>
    </section>
  );
};
