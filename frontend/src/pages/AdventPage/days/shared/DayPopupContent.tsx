import type { DayPopupProps } from '../types';

export const DayPopupContent = ({ entry, onStart, onClose }: DayPopupProps) => (
  <>
    {entry.status === 'published' && (
      <div className="advent-popup__image aspect-video" aria-hidden="true" />
    )}
    <div className="advent-popup__body">
      <h2 id="package-title">{entry.title}</h2>
      <p id="package-description">{entry.description}</p>
      {entry.status === 'published' &&
        (onStart ? (
          <button
            type="button"
            className="calendar-card__link"
            onClick={onStart}
          >
            Start challenge
          </button>
        ) : (
          entry.link && (
            <a
              className="calendar-card__link"
              href={entry.link}
              onClick={onClose}
            >
              {entry.linkLabel}
            </a>
          )
        ))}
      {entry.status === 'finished' && (
        <p className="calendar-card__closed">
          Denne luken er avsluttet. Takk for at du fulgte med!
        </p>
      )}
    </div>
  </>
);
