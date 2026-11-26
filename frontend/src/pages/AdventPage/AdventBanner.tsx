import './AdventBanner.css';

import type { AdventEntry } from './types';

export const AdventBanner = ({
  entries,
  onSelect,
}: {
  entries: AdventEntry[];
  onSelect: (entry: AdventEntry) => void;
}) => (
  <section className="advent-banner" aria-labelledby="advent-title">
    <div className="advent-banner__heading">
      <div>
        <h1 id="advent-title" className="mt-2 text-3xl font-bold sm:text-5xl">
          Adventskalender
        </h1>
      </div>
    </div>
    <div className="advent-banner__grid">
      {entries.map((entry, index) => {
        const { date } = entry;
        const day = Number(date.slice(8));
        const month = date.slice(5, 7) === '11' ? 'nov' : 'des';
        return (
          <button
            key={date}
            type="button"
            id={`luke-${date}`}
            onClick={() => onSelect(entry)}
            aria-haspopup="dialog"
            className={`advent-gift advent-gift--${index + 1} advent-gift--${entry.status}`}
            aria-label={`${day}. ${month === 'nov' ? 'november' : 'desember'} 2026 – ${entry.status === 'published' ? 'åpen nå' : entry.status === 'finished' ? 'avsluttet' : 'kommer snart'} – vis pakken`}
          >
            <span className="advent-gift__ribbon" aria-hidden="true" />
            <span className="advent-gift__bow" aria-hidden="true" />
            <time dateTime={date} className="advent-gift__date">
              <span className="advent-gift__day">{day}</span>
              <span className="advent-gift__month">{month}</span>
            </time>
          </button>
        );
      })}
    </div>
  </section>
);
