import { useEffect, useState } from 'react';
import { AdventBanner } from './AdventBanner';
import { AdventPopup } from './AdventPopup';
import { Header } from '../../components/PageSections/Header/Header';
import { Footer } from '../../components/PageSections/Footer/Footer';
import { AppLayout } from '../../components/Layout/AppLayout';
import type { AdventEntry } from './types';
import './AdventPage.css';

export const AdventPage = () => {
  const [selected, setSelected] = useState<AdventEntry | null>(null);
  const [entries, setEntries] = useState<AdventEntry[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(import.meta.env.DEV);
  const visibleEntries =
    import.meta.env.DEV && preview
      ? entries.map(
          (entry, index): AdventEntry =>
            index < 2
              ? {
                  date: entry.date,
                  status: 'published',
                  title:
                    index === 0
                      ? 'En liten førjulsoverraskelse'
                      : 'Dagens juleutfordring',
                  description:
                    'Dette er eksempelinnhold. Her kan dere presentere dagens premie, oppgave eller aktivitet og forklare hvordan man deltar.',
                  link: '#preview-info',
                  linkLabel: 'Se eksempel på deltakelse',
                }
              : index === 2
                ? {
                    date: entry.date,
                    status: 'finished',
                    title: 'Takk for denne gang!',
                    description:
                      'Eksempel på en avsluttet luke. Innholdet kan fortsatt leses, men deltakelsen er stengt.',
                  }
                : entry,
        )
      : entries;

  useEffect(() => {
    if (state !== 'ready' || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
  }, [state]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/advent', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Could not load calendar');
        const data: AdventEntry[] = await response.json();
        setEntries(data);
        setState('ready');
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('error');
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <>
      <Header />
      <AppLayout>
        <section className="advent-page" aria-label="Adventskalender 2026">
          {import.meta.env.DEV && (
            <div
              id="preview-info"
              className="advent-page__notice mb-6 border-2 border-black bg-white p-4"
            >
              <strong>Lokal forhåndsvisning</strong>
              <p>
                {preview
                  ? 'Viser eksempelinnhold med to aktive og én avsluttet luke. Dette publiseres ikke.'
                  : 'Viser de ekte publiseringsstatusene.'}
              </p>
              <button onClick={() => setPreview(!preview)}>
                {preview ? 'Vis ekte innhold' : 'Vis aktive eksempler'}
              </button>
            </div>
          )}
          {state === 'loading' && <p role="status">Henter pakkene …</p>}
          {state === 'error' && (
            <div role="alert" className="advent-page__notice">
              <p>Vi fikk ikke hentet kalenderen. Prøv igjen om litt.</p>
              <button
                onClick={() => {
                  setState('loading');
                  setAttempt(attempt + 1);
                }}
              >
                Prøv igjen
              </button>
            </div>
          )}
          {state === 'ready' && (
            <AdventBanner entries={visibleEntries} onSelect={setSelected} />
          )}
          {selected && (
            <AdventPopup
              key={selected.date}
              entry={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </section>
      </AppLayout>
      <Footer />
    </>
  );
};
