import { useEffect, useState } from 'react';
import './Countdown.css';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = () => {
  const targetDate = new Date('2026-03-03T10:00:00');

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

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    calculateTimeRemaining(),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [animations, setAnimations] = useState({
    days: { value: timeRemaining.days, prev: timeRemaining.days },
    hours: { value: timeRemaining.hours, prev: timeRemaining.hours },
    minutes: { value: timeRemaining.minutes, prev: timeRemaining.minutes },
    seconds: { value: timeRemaining.seconds, prev: timeRemaining.seconds }
  });

  useEffect(() => {
    setAnimations(prev => ({
      days: { prev: prev.days.value, value: timeRemaining.days },
      hours: { prev: prev.hours.value, value: timeRemaining.hours },
      minutes: { prev: prev.minutes.value, value: timeRemaining.minutes },
      seconds: { prev: prev.seconds.value, value: timeRemaining.seconds }
    }));
  }, [timeRemaining]);

  return (
    <section className="-mt-20 flex flex-col items-center gap-8">
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        <div className="bg-dotgreen flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <div className="number-container h-16">
            <div key={`prev-${animations.days.prev}`} className="text-4xl font-bold number-slide number-slide-exit">
              {animations.days.prev}
            </div>
            <div key={`curr-${animations.days.value}`} className="text-4xl font-bold number-slide">
              {animations.days.value}
            </div>
          </div>
          <p>DAGER</p>
        </div>
        <div className="bg-dotpurple flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <div className="number-container h-16">
            <div key={`prev-${animations.hours.prev}`} className="text-4xl font-bold number-slide number-slide-exit">
              {animations.hours.prev}
            </div>
            <div key={`curr-${animations.hours.value}`} className="text-4xl font-bold number-slide">
              {animations.hours.value}
            </div>
          </div>
          <p>TIMER</p>
        </div>
        <div className="bg-dotyellow flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <div className="number-container h-16">
            <div key={`prev-${animations.minutes.prev}`} className="text-4xl font-bold number-slide number-slide-exit">
              {animations.minutes.prev}
            </div>
            <div key={`curr-${animations.minutes.value}`} className="text-4xl font-bold number-slide">
              {animations.minutes.value}
            </div>
          </div>
          <p>MINUTTER</p>
        </div>
        <div className="bg-dotgreen flex h-36 w-54 flex-col items-center justify-center border-3 border-black text-white">
          <div className="number-container h-16">
            <div key={`prev-${animations.seconds.prev}`} className="text-4xl font-bold number-slide number-slide-exit">
              {animations.seconds.prev}
            </div>
            <div key={`curr-${animations.seconds.value}`} className="text-4xl font-bold number-slide">
              {animations.seconds.value}
            </div>
          </div>
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
          Realfagsbygget U1, Gløshaugen
        </a>
      </div>
    </section>
  );
};
