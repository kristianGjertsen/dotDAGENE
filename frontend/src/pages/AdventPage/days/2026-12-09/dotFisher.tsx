


import dotman from './media/dotman.png';
import dotHand from './media/dotHand.png';
import rod from './media/rod.png';

export default function DotFisher() {
  return (
    <div
      role="img"
      aria-label="Dotman holding a fishing rod"
      className="relative aspect-[1010/735] w-full max-w-[520px] shrink-0 select-none"
    >
      <img
        src={dotman}
        alt=""
        draggable={false}
        className="pointer-events-none absolute bottom-0 left-0 h-auto w-[51.98%]"
      />
      {/* The back hand sits behind the rod; the front hand wraps over it. */}
      <img
        src={dotHand}
        alt=""
        draggable={false}
        className="pointer-events-none absolute top-[58.5%] left-[57.62%] h-auto w-[12.97%]"
      />
      <img
        src={rod}
        alt=""
        draggable={false}
        className="pointer-events-none absolute top-0 left-[52.87%] h-auto w-[47.13%]"
      />
      <img
        src={dotHand}
        alt=""
        draggable={false}
        className="pointer-events-none absolute top-[68.03%] left-[54.95%] h-auto w-[12.97%]"
      />
    </div>
  );
}
