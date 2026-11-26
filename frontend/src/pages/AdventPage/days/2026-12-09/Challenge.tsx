import { useEffect, useReducer, useRef, useState, type CSSProperties } from 'react';
import background from './media/background.png';
import DotFisher from './dotFisher';
import { QuestionBox } from './QuestionBox';
import { submitAnswerToVercel } from './answerApi';
import { submitDotillionResult } from './resultApi';
import { CORRECT_DROP, INCORRECT_DROP, INITIAL_DEPTH, gameReducer, initialGame, questions, validateParticipant } from './dotillionGame';
import './Dotillion.css';
import dotillionLogo from './media/dotillionLogo.png';

export const Challenge = () => {
  const [game, dispatch] = useReducer(gameReducer, initialGame);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const resultSubmission = useRef<Promise<void> | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const canStart = validateParticipant(name, mobile) !== null;
  const scene = useRef<HTMLElement>(null);
  const hook = useRef<SVGSVGElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const answerInput = useRef<HTMLInputElement>(null);
  const pendingRequest = useRef<AbortController | null>(null);
  const nextRequestId = useRef(0);
  const [requestError, setRequestError] = useState<{ questionIndex: number; message: string } | null>(null);
  const lastResult = game.results.at(-1);
  const feedback = lastResult === undefined
    ? 'Senker kroken…'
    : lastResult.valid
      ? `Treff! +${lastResult.score} poeng. Kroken går ${CORRECT_DROP} meter dypere.`
      : `Tiden er ute! 0 poeng. Kroken går ${INCORRECT_DROP} meter dypere.`;
  const question = questions[game.results.length];

  useEffect(() => {
    if (game.phase !== 'finished' || !game.participant) return;
    let active = true;
    resultSubmission.current ??= submitDotillionResult({
      id: crypto.randomUUID(),
      ...game.participant,
      score: game.score,
    });
    void resultSubmission.current.then(
      () => { if (active) setSaveStatus('saved'); },
      () => { if (active) setSaveStatus('error'); },
    );
    return () => { active = false; };
  }, [game.phase, game.participant, game.score]);

  useEffect(() => {
    // Keep an in-time submission alive at zero seconds; cancel only when leaving the question.
    return () => {
      pendingRequest.current?.abort();
      pendingRequest.current = null;
    };
  }, [game.phase, game.results.length]);

  const submitAnswer = async (answer: string) => {
    if (game.phase !== 'question' || game.questionDeadline === null || pendingRequest.current) return;
    const questionIndex = game.results.length;
    const submittedAt = Date.now();
    if (submittedAt >= game.questionDeadline) {
      dispatch({ type: 'tick', now: submittedAt, questionIndex });
      return;
    }

    const controller = new AbortController();
    const requestId = ++nextRequestId.current;
    pendingRequest.current = controller;
    dispatch({ type: 'answer_submitted', requestId, submittedAt, questionIndex });
    setRequestError(null);

    try {
      const result = await submitAnswerToVercel(question.id, answer, controller.signal);
      if (!controller.signal.aborted) {
        dispatch({ type: 'answer_result', requestId, result, now: Date.now(), questionIndex });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        dispatch({ type: 'request_failed', requestId, now: Date.now(), questionIndex });
        setRequestError({
          questionIndex,
          message: error instanceof Error ? error.message : 'Kunne ikke kontakte serveren. Prøv igjen.',
        });
      }
    } finally {
      if (pendingRequest.current === controller) {
        pendingRequest.current = null;
      }
    }
  };

  useEffect(() => {
    const dialog = scene.current?.closest('dialog');
    dialog?.classList.add('advent-popup--dotillion');
    if (dialog) dialog.scrollTop = 0;
    return () => dialog?.classList.remove('advent-popup--dotillion');
  }, []);

  useEffect(() => {
    if (game.phase !== 'question') return;
    const questionIndex = game.results.length;
    const tick = () => dispatch({ type: 'tick', now: Date.now(), questionIndex });
    const timer = window.setInterval(tick, 100);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [game.phase, game.results.length]);

  useEffect(() => {
    const dialog = scene.current?.closest('dialog');
    if (!dialog) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (game.phase === 'question' || game.phase === 'idle') {
      const alignQuestion = () => {
        if (!card.current) return;
        const bounds = dialog.getBoundingClientRect();
        const cardBounds = card.current.getBoundingClientRect();
        const viewport = window.visualViewport;
        const visibleTop = Math.max(bounds.top, viewport?.offsetTop ?? 0);
        const visibleBottom = Math.min(bounds.bottom, viewport ? viewport.offsetTop + viewport.height : window.innerHeight);
        const spaceAbove = Math.max(12, (visibleBottom - visibleTop - cardBounds.height) / 2);
        dialog.scrollTop += cardBounds.top - visibleTop - spaceAbove;
      };
      if (game.phase === 'question') answerInput.current?.focus({ preventScroll: true });
      alignQuestion();
      window.addEventListener('resize', alignQuestion);
      window.visualViewport?.addEventListener('resize', alignQuestion);
      return () => {
        window.removeEventListener('resize', alignQuestion);
        window.visualViewport?.removeEventListener('resize', alignQuestion);
      };
    }

    if (game.phase === 'finished') {
      dialog.scrollTop = 0;
      heading.current?.focus({ preventScroll: true });
      return;
    }

    if (game.phase === 'returning') {
      if (reducedMotion) {
        dialog.scrollTop = 0;
        dispatch({ type: 'returned' });
        return;
      }
      const from = dialog.scrollTop;
      const started = performance.now();
      let frame = 0;
      const returnToSurface = (now: number) => {
        const progress = Math.min((now - started) / 1400, 1);
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        dialog.scrollTop = from * (1 - eased);
        if (progress < 1) frame = requestAnimationFrame(returnToSurface);
        else dispatch({ type: 'returned' });
      };
      frame = requestAnimationFrame(returnToSurface);
      return () => cancelAnimationFrame(frame);
    }

    if (game.phase !== 'lowering') return;
    let frame = 0;
    const followHook = () => {
      if (hook.current) {
        const target = dialog.getBoundingClientRect().top + dialog.clientHeight * 0.4;
        const distance = hook.current.getBoundingClientRect().bottom - target;
        if (distance > 0) dialog.scrollTop += distance;
      }
      frame = requestAnimationFrame(followHook);
    };
    frame = requestAnimationFrame(followHook);
    return () => cancelAnimationFrame(frame);
  }, [game.phase]);

  const depthStyle = {
    '--hook-depth': `${game.depth}cqw`,
    '--from-depth': game.previousDepth === null ? 'var(--rod-top)' : `${game.previousDepth}cqw`,
  } as CSSProperties;

  return (
    <section ref={scene} className="dotillion w-full">
      <div className="dotillion__world" style={depthStyle}>
        <div className="dotillion__background" style={{ backgroundImage: `url(${background})` }} />
        <div className="relative z-10 flex flex-col items-center px-4 pt-4 sm:pt-10">
          <h1 id="package-title" className="mb-4 w-64 sm:w-80">
            <img src={dotillionLogo} alt="Dotillion!" className="h-auto w-full" />
          </h1>

          <p id="package-description" className="sr-only">Svar på fire julespørsmål. Treff i svarlisten sender kroken lengre ned i dypet.</p>
          {game.phase === 'finished' ? (
            <div className="mt-3 w-full max-w-sm rounded-xl border-2 border-black bg-white p-5 text-center text-slate-900 shadow-lg">
              <p className="mb-2 text-sm font-semibold text-green-800">Tilbake på isen, {game.participant?.name}!</p>
              <h2 ref={heading} tabIndex={-1} className="text-2xl font-bold focus:outline-none">Poeng: {game.score}</h2>
              <p className="mt-2">Du fisket deg {game.depth - INITIAL_DEPTH} meter ned.</p>
              <p role="status" className="mt-4 text-sm">
                {saveStatus === 'saved' ? 'Resultatet er lagret. Du er med i konkurransen!'
                  : saveStatus === 'error' ? 'Resultatet ble ikke lagret. Kunne ikke kontakte serveren.'
                    : 'Sender inn resultatet …'}
              </p>
            </div>
          ) : game.phase === 'idle' ? (
            <div ref={card} className="mt-3 w-full max-w-sm rounded-xl border-2 border-black bg-white p-4 text-slate-900 shadow-lg">
              <form onSubmit={(event) => {
                event.preventDefault();
                if (!canStart) return;
                if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
                dispatch({ type: 'start', name, mobile });
              }}>
                <p className="mb-3 text-sm">Fyll inn navn og mobilnummer for å starte.</p>
                <label htmlFor="dotillion-name" className="mb-1 block font-semibold">Navn</label>
                <input
                  id="dotillion-name" name="name" type="text" autoComplete="name"
                  required maxLength={80} value={name} onChange={(event) => setName(event.target.value)}
                  className="w-full rounded border-2 border-slate-300 px-3 py-2 text-base focus:border-green-800 focus:outline-none"
                />
                <label htmlFor="dotillion-mobile" className="mt-3 mb-1 block font-semibold">Mobilnummer</label>
                <input
                  id="dotillion-mobile" name="mobile" type="tel" inputMode="tel" autoComplete="tel"
                  aria-describedby="dotillion-mobile-hint" required maxLength={24}
                  value={mobile} onChange={(event) => setMobile(event.target.value)}
                  className="w-full rounded border-2 border-slate-300 px-3 py-2 text-base focus:border-green-800 focus:outline-none"
                />
                <p id="dotillion-mobile-hint" className="mt-1 text-xs text-slate-600">Norsk mobilnummer: 8 sifre som starter med 4 eller 9. +47 er valgfritt.</p>
                <button type="submit" disabled={!canStart} className="mt-4 w-full rounded bg-green-800 px-5 py-2 font-bold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-50">Start utfordringen</button>
              </form>
            </div>
          ) : null}
        </div>
        <p role="status" className="sr-only">{game.phase === 'lowering' ? feedback : game.phase === 'returning' ? 'Tilbake til overflaten…' : ''}</p>

        <div className="dotillion__fisher absolute right-1/2 w-[24%] max-w-[190px]"><DotFisher /></div>

        {game.phase !== 'idle' && (
          <div className="dotillion__line-track pointer-events-none absolute left-1/2" aria-hidden="true">
            <div
              key={game.results.length}
              className="dotillion__line"
              style={{ animationDelay: game.results.length === 0 ? '1s' : '0s' }}
              onAnimationEnd={(event) => {
                if (event.target === event.currentTarget) dispatch({ type: 'landed', now: Date.now() });
              }}
            >
              <svg ref={hook} className="dotillion__hook" viewBox="0 0 24 32" fill="none">
                <path d="M12 1v20a8 8 0 0 1-8-8l4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {game.phase === 'lowering' && <span className="dotillion__feedback rounded-lg bg-slate-950/85 px-3 py-2 text-center text-sm font-semibold text-white">{feedback}</span>}
            </div>
          </div>
        )}

        {game.phase === 'question' && game.questionDeadline !== null && (
          <QuestionBox
            question={question.text}
            depth={game.depth - INITIAL_DEPTH}
            deadline={game.questionDeadline}
            wrongAttempts={game.wrongAttempts}
            submitting={game.pendingSubmission !== null}
            requestError={requestError?.questionIndex === game.results.length ? requestError.message : undefined}
            containerRef={card}
            inputRef={answerInput}
            onAnswer={submitAnswer}
          />
        )}
      </div>
    </section>
  );
};
