import { useState } from 'react';
import { Gift, Snowflake, Star } from 'lucide-react';
import type { ChallengeProps } from '../types';

// A working example to replace with each day's actual challenge.
export const ChallengeExample = ({ onComplete, onBack }: ChallengeProps) => {
  const [feedback, setFeedback] = useState('');
  return (
    <div className="advent-popup__body">
      <h2 id="package-title">Finn snøfnugget</h2>
      <p id="package-description">
        Eksempeloppgave: Trykk på snøfnugget for å fullføre.
      </p>
      <div className="advent-challenge__choices">
        <button
          type="button"
          aria-label="Gave"
          onClick={() => setFeedback('Det var en gave. Prøv igjen!')}
        >
          <Gift aria-hidden="true" />
        </button>
        <button type="button" aria-label="Snøfnugg" onClick={onComplete}>
          <Snowflake aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Stjerne"
          onClick={() => setFeedback('Det var en stjerne. Prøv igjen!')}
        >
          <Star aria-hidden="true" />
        </button>
      </div>
      <p role="status">{feedback}</p>
      <button type="button" className="calendar-card__link" onClick={onBack}>
        Tilbake til pakken
      </button>
    </div>
  );
};
