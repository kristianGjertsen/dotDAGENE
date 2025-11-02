import { useEffect, useState } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
}

export const Countdown = () => {
  const targetDate = new Date('2026-03-03T10:00:00');

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-16 flex flex-col items-center gap-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        <div className="bg-dotgreen flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <p className="text-4xl font-bold">{timeRemaining.days}</p>
          <p>DAGER</p>
        </div>
        <div className="bg-dotpurple flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <p className="text-4xl font-bold">{timeRemaining.hours}</p>
          <p>TIMER</p>
        </div>
        <div className="bg-dotyellow flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <p className="text-4xl font-bold">{timeRemaining.minutes}</p>
          <p>MINUTTER</p>
        </div>
      </div>
      <div>
        3. mars 2026 ·&nbsp;
        <a
          href="https://link.mazemap.com/aev0cjsq"
          className="font-medium underline"
          target="_blank"
        >
          Realfagsbygget U1, Gløshaugen
        </a>
      </div>
    </section>
  );
};
