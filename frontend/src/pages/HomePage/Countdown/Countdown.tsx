import { useEffect, useState } from 'react';
import './Countdown.css';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const countdownItems: { key: keyof TimeRemaining; label: string }[] = [
  { key: 'days', label: 'Dager' },
  { key: 'hours', label: 'Timer' },
  { key: 'minutes', label: 'Minutter' },
  { key: 'seconds', label: 'Sekunder' },
];

const targetDate = new Date('2027-02-09T10:00:00');

const calculateTimeRemaining = (): TimeRemaining => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

export const Countdown = () => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(),
  );

  const [animations, setAnimations] = useState({
    days: { value: timeRemaining.days, prev: timeRemaining.days },
    hours: { value: timeRemaining.hours, prev: timeRemaining.hours },
    minutes: { value: timeRemaining.minutes, prev: timeRemaining.minutes },
    seconds: { value: timeRemaining.seconds, prev: timeRemaining.seconds },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimations((prev) => ({
      days: { prev: prev.days.value, value: timeRemaining.days },
      hours: { prev: prev.hours.value, value: timeRemaining.hours },
      minutes: { prev: prev.minutes.value, value: timeRemaining.minutes },
      seconds: { prev: prev.seconds.value, value: timeRemaining.seconds },
    }));
  }, [timeRemaining]);

  return (
    <section className="flex flex-col items-center gap-6 px-4">
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/*  */}
        {countdownItems.map(({ key, label }) => (
          <div
            key={key}
            className="bg-primary mx-auto flex h-24 w-24 flex-col items-center justify-center border-2 border-black text-white sm:h-28 sm:w-28 md:h-30 md:w-30"
          >
            <div className="number-container h-12 sm:h-16">
              <div
                key={`prev-${key}-${animations[key].prev}`}
                className="number-slide number-slide-exit text-3xl font-bold sm:text-4xl"
              >
                {animations[key].prev}
              </div>
              <div
                key={`curr-${key}-${animations[key].value}`}
                className="number-slide text-3xl font-bold sm:text-4xl"
              >
                {animations[key].value}
              </div>
            </div>
            <p>{label}</p>
          </div>
        ))}
      </div>
      <div>
        9 og 10. februar 2027 ·&nbsp;
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
