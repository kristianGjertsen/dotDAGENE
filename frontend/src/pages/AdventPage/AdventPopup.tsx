import { useEffect, useRef, useState } from 'react';
import { Gift, LockKeyhole, Check, X } from 'lucide-react';
import type { AdventEntry } from './types';
import { adventDays } from './days';
import { DayPopupContent } from './days/shared/DayPopupContent';

export const AdventPopup = ({
  entry,
  onClose,
}: {
  entry: AdventEntry;
  onClose: () => void;
}) => {
  const [view, setView] = useState<'intro' | 'challenge' | 'complete'>('intro');
  const dayDefinition = adventDays[entry.date];
  const Popup = dayDefinition?.Popup ?? DayPopupContent;
  const Challenge = dayDefinition?.Challenge;
  const canStart =
    entry.status === 'published' &&
    dayDefinition?.challengeEnabled &&
    !!Challenge;
  const dialog = useRef<HTMLDialogElement>(null);
  const day = Number(entry.date.slice(8));
  const month = entry.date.slice(5, 7) === '11' ? 'november' : 'desember';
  const closed = entry.status === 'coming';
  const Icon = closed
    ? LockKeyhole
    : entry.status === 'finished'
      ? Check
      : Gift;

  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const heading = dialog.current?.querySelector<HTMLElement>('#package-title');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus();
  }, [view]);

  return (
    <dialog
      ref={dialog}
      className="advent-popup"
      aria-labelledby="package-title"
      aria-describedby="package-description"
      onClose={() => {
        // StrictMode reopens the dialog before its cleanup's queued close event.
        if (!dialog.current?.open) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <button
        className="advent-popup__close"
        type="button"
        aria-label="Lukk pakken"
        onClick={onClose}
        autoFocus
      >
        <X size={24} />
      </button>
      <div className="advent-popup__header">
        <Icon size={40} aria-hidden="true" />
        <time dateTime={entry.date}>
          {day}. {month} 2026
        </time>
      </div>
      {closed ? (
        <div className="advent-popup__body">
          <h2 id="package-title">
            Åpner {day}. {month}
          </h2>
          <p id="package-description">Denne pakken er ikke åpen ennå</p>
        </div>
      ) : view === 'challenge' && canStart && Challenge ? (
        <Challenge
          onBack={() => setView('intro')}
          onComplete={() => setView('complete')}
        />
      ) : view === 'complete' && canStart ? (
        <div className="advent-popup__body">
          <h2 id="package-title">Challenge fullført!</h2>
          <p id="package-description">Bra jobbet! Du har løst oppgaven.</p>
          <button
            type="button"
            className="calendar-card__link"
            onClick={() => setView('intro')}
          >
            Tilbake til pakken
          </button>
          <button
            type="button"
            className="calendar-card__link ml-3"
            onClick={onClose}
          >
            Lukk
          </button>
        </div>
      ) : (
        <Popup
          entry={entry}
          onClose={onClose}
          onStart={canStart ? () => setView('challenge') : undefined}
        />
      )}
    </dialog>
  );
};
