import { useRef, useState, type FormEvent } from 'react';
import type { ChallengeProps } from '../types';
import { MAX_ATTEMPTS, normalizeWord, type LetterState } from './logic';
import './Dodle.css';

interface GameView {
  token: string;
  name: string;
  guesses: { word: string; scores: LetterState[] }[];
  status: 'playing' | 'won' | 'lost';
  answer?: string;
}
const STORAGE_KEY = 'dotdagene-dodle-2026-11-29';
const stateLabels = {
  correct: 'riktig plass',
  present: 'feil plass',
  absent: 'ikke i ordet',
};
const priority = { absent: 1, present: 2, correct: 3 };

function loadGame(): GameView | null {
  try {
    const game = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null');
    return game &&
      typeof game.token === 'string' &&
      typeof game.name === 'string' &&
      Array.isArray(game.guesses) &&
      game.guesses.length <= 6 &&
      ['playing', 'won', 'lost'].includes(game.status)
      ? game
      : null;
  } catch {
    return null;
  }
}
async function request<T>(body: unknown): Promise<T> {
  const response = await fetch('/api/dodle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? 'Noe gikk galt. Prøv igjen.');
  return data;
}

export const Challenge = ({ onComplete, onBack }: ChallengeProps) => {
  const [game, setGame] = useState<GameView | null>(loadGame);
  const [name, setName] = useState('');
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<'saved' | 'preview' | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  function remember(next: GameView) {
    setGame(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* Storage is optional. */
    }
  }
  async function run(action: () => Promise<void>) {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage('');
    try {
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Prøv igjen.');
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  function start(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      remember(await request<GameView>({ action: 'start', name: name.trim() }));
    });
  }
  function submitGuess(event?: FormEvent) {
    event?.preventDefault();
    if (!game || game.status !== 'playing' || busy) return;
    const word = normalizeWord(guess);
    if (word.length !== 5) {
      setMessage('Ordet må ha fem bokstaver.');
      return;
    }
    void run(async () => {
      const next = await request<GameView>({
        action: 'guess',
        token: game.token,
        word,
      });
      remember(next);
      setGuess('');
      setMessage(
        next.status === 'playing'
          ? next.guesses
              .at(-1)!
              .scores.map(
                (score, i) => `${word[i].toUpperCase()}: ${stateLabels[score]}`,
              )
              .join(', ')
          : '',
      );
      input.current?.focus();
    });
  }
  function reset() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Storage is optional. */
    }
    setGame(null);
    setSaved(null);
    setGuess('');
    setMessage('');
  }
  const keys: Record<string, LetterState> = {};
  game?.guesses.forEach((row) =>
    [...row.word].forEach((letter, i) => {
      const score = row.scores[i];
      if (!keys[letter] || priority[score] > priority[keys[letter]])
        keys[letter] = score;
    }),
  );

  return (
    <div className="advent-popup__body dodle">
      <h2 id="package-title">Dodle</h2>

      {!game ? (
        <form onSubmit={start}>
          <label htmlFor="dodle-name">Navnet ditt</label>
          <input
            id="dodle-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            autoComplete="name"
            required
            disabled={busy}
          />
          <p className="dodle__hint">
            Når du klarer ordet, kan du sende inn navn og fullført-status til
            konkurransen. Tapte spill sendes ikke inn.
          </p>
          <button
            className="calendar-card__link"
            disabled={busy || !name.trim()}
          >
            {busy ? 'Starter …' : 'Start Dodle'}
          </button>
        </form>
      ) : (
        <>
          <p className="mt-3">
            Spiller: <strong>{game.name}</strong> · {game.guesses.length}/
            {MAX_ATTEMPTS} forsøk
          </p>
          <p className="dodle__hint">
            Grønn: riktig plass · Gul: feil plass · Grå: ikke i ordet
          </p>
          <div className="dodle__board" aria-label="Spillbrett">
            {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
              const row = game.guesses[rowIndex];
              const word =
                row?.word ?? (rowIndex === game.guesses.length ? guess : '');
              return (
                <div
                  className="dodle__row"
                  key={rowIndex}
                  aria-label={`Forsøk ${rowIndex + 1}`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className="dodle__tile"
                      data-state={row?.scores[i]}
                      aria-label={
                        row
                          ? `${word[i]}: ${stateLabels[row.scores[i]]}`
                          : word[i] || 'Tom rute'
                      }
                    >
                      {word[i]}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
          {game.status === 'playing' && (
            <>
              <form onSubmit={submitGuess}>
                <label htmlFor="dodle-guess">Ditt ord</label>
                <input
                  ref={input}
                  id="dodle-guess"
                  value={guess}
                  onChange={(e) => {
                    setGuess(
                      normalizeWord(e.target.value)
                        .replace(/[^a-zæøå]/g, '')
                        .slice(0, 5),
                    );
                    setMessage('');
                  }}
                  maxLength={5}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  readOnly={busy}
                />
                <button className="calendar-card__link" disabled={busy}>
                  {busy ? 'Sjekker …' : 'Gjett'}
                </button>
              </form>
              <div className="dodle__keyboard" aria-label="Norsk tastatur">
                {['qwertyuiopå', 'asdfghjkløæ', 'zxcvbnm'].map((row, i) => (
                  <div key={row} className="dodle__keys">
                    {i === 2 && (
                      <button
                        type="button"
                        className="dodle__wide"
                        disabled={busy}
                        onClick={() => submitGuess()}
                      >
                        Gjett
                      </button>
                    )}
                    {[...row].map((letter) => (
                      <button
                        key={letter}
                        type="button"
                        data-state={keys[letter]}
                        disabled={busy}
                        aria-label={`Bokstav ${letter}`}
                        onClick={() => {
                          setGuess((value) => (value + letter).slice(0, 5));
                          setMessage('');
                        }}
                      >
                        {letter.toUpperCase()}
                      </button>
                    ))}
                    {i === 2 && (
                      <button
                        type="button"
                        className="dodle__wide"
                        disabled={busy}
                        onClick={() => setGuess((value) => value.slice(0, -1))}
                      >
                        Slett
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          {game.status === 'won' && (
            <div role="status" className="mt-5">
              <h3 className="text-xl font-bold">Du klarte det, {game.name}!</h3>
              <p>Du fant ordet på {game.guesses.length} forsøk.</p>
              {saved ? (
                <>
                  <p>
                    {saved === 'saved'
                      ? 'Resultatet er lagret. Du er med i konkurransen!'
                      : 'Test fullført. Lokal forhåndsvisning lagrer ikke resultater.'}
                  </p>
                  <button className="calendar-card__link" onClick={onComplete}>
                    Ferdig
                  </button>
                </>
              ) : (
                <button
                  className="calendar-card__link"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      const result = await request<{
                        saved: boolean;
                        preview: boolean;
                      }>({ action: 'complete', token: game.token });
                      if (!result.saved && !result.preview)
                        throw new Error(
                          'Resultatet ble ikke lagret. Prøv igjen.',
                        );
                      setSaved(result.saved ? 'saved' : 'preview');
                    })
                  }
                >
                  {busy ? 'Sender inn …' : 'Send inn at jeg klarte det'}
                </button>
              )}
            </div>
          )}
          {game.status === 'lost' && (
            <div role="status" className="mt-5">
              <h3 className="text-xl font-bold">Ingen forsøk igjen</h3>
              <p>
                Ordet var <strong>{game.answer?.toUpperCase()}</strong>. Dette
                spillet blir ikke sendt inn.
              </p>
              <button className="calendar-card__link" onClick={reset}>
                Prøv et nytt ord
              </button>
            </div>
          )}
        </>
      )}
      <p className="dodle__feedback" role="status">
        {message}
      </p>
      <div className="dodle__actions">
        <button
          type="button"
          className="calendar-card__link"
          onClick={onBack}
          disabled={busy}
        >
          Tilbake til pakken
        </button>
        {game && message.includes('utløpt') && (
          <button type="button" className="calendar-card__link" onClick={reset}>
            Start på nytt
          </button>
        )}
      </div>
    </div>
  );
};
