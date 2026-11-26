import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { normalizeAnswer, QUESTION_DURATION_MS } from './dotillionGame';

interface QuestionBoxProps {
  question: string;
  depth: number;
  deadline: number;
  wrongAttempts: number;
  onAnswer: (answer: string) => void | Promise<void>;
  submitting?: boolean;
  requestError?: string;
  containerRef?: Ref<HTMLDivElement>;
  inputRef?: Ref<HTMLInputElement>;
}

export const QuestionBox = ({
  question,
  depth,
  deadline,
  wrongAttempts,
  onAnswer,
  submitting = false,
  requestError,
  containerRef,
  inputRef,
}: QuestionBoxProps) => {
  const questionId = useId();
  const feedbackId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [clearedErrorAttempt, setClearedErrorAttempt] = useState(0);
  const hasAnswerError = wrongAttempts > clearedErrorAttempt;
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, Math.min(QUESTION_DURATION_MS, deadline - Date.now())),
  );

  useEffect(() => {
    let frame = 0;
    const updateCountdown = () => {
      // Use the game's deadline so redraws and wrong guesses never reset the timer.
      const remaining = Math.max(0, Math.min(QUESTION_DURATION_MS, deadline - Date.now()));
      setRemainingMs(remaining);
      if (remaining > 0) frame = requestAnimationFrame(updateCountdown);
    };
    frame = requestAnimationFrame(updateCountdown);
    return () => cancelAnimationFrame(frame);
  }, [deadline]);

  useEffect(() => {
    if (wrongAttempts === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const input = formRef.current?.elements.namedItem('answer');
    if (!(input instanceof HTMLInputElement)) return;
    // Restart for every wrong answer without replacing the focused input.
    const animation = input.animate(
      [0, -6, 6, -4, 4, 0].map((offset) => ({ transform: `translateX(${offset}px)` })),
      { duration: 320, easing: 'ease-in-out' },
    );
    return () => animation.cancel();
  }, [wrongAttempts]);

  const progress = remainingMs / QUESTION_DURATION_MS;
  const timerColor = `hsl(${120 * progress} 85% 65%)`;
  const timerText = (Math.ceil(remainingMs / 100) / 10).toFixed(1).replace('.', ',');

  return (
    <div ref={containerRef} className="dotillion__card absolute right-4 left-4 mx-auto max-w-lg text-center text-white">
      <h2 id={questionId} className="text-xl font-bold drop-shadow-md sm:text-2xl">{question}</h2>
      <div className="mt-3 flex items-center justify-between text-sm">
        <p className="text-white/80">Dybde: {depth} m</p>
        <p role="timer" aria-label="Tid igjen" className="w-16 text-right font-bold tabular-nums" style={{ color: timerColor }}>{timerText} s</p>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20" aria-hidden="true">
        <div className="h-full origin-left" style={{ transform: `scaleX(${progress})`, backgroundColor: timerColor }} />
      </div>
      <form ref={formRef} aria-busy={submitting} className="mt-4 flex items-stretch gap-2" onSubmit={(event) => {
        event.preventDefault();
        if (submitting || Date.now() >= deadline) return;
        const input = event.currentTarget.elements.namedItem('answer') as HTMLInputElement;
        if (!normalizeAnswer(input.value)) {
          input.setCustomValidity('Skriv et svar først.');
          input.reportValidity();
          return;
        }
        void onAnswer(input.value);
        input.focus({ preventScroll: true });
        input.select();
      }}>
        <input
          ref={inputRef} name="answer" aria-labelledby={questionId} aria-describedby={feedbackId} placeholder="Skriv ett svar…"
          required maxLength={120} autoComplete="off" enterKeyHint="send"
          readOnly={submitting || remainingMs === 0}
          aria-invalid={hasAnswerError}
          onInput={(event) => {
            event.currentTarget.setCustomValidity('');
            setClearedErrorAttempt(wrongAttempts);
          }}
          className={`min-w-0 flex-1 rounded border-2 bg-white px-3 py-3 text-base text-slate-900 focus:outline-none ${hasAnswerError ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-cyan-300'}`}
        />
        <button type="submit" disabled={submitting || remainingMs === 0} className="shrink-0 rounded bg-green-800 px-3 py-3 text-sm font-bold whitespace-nowrap text-white hover:bg-green-900 disabled:cursor-wait disabled:opacity-70 sm:px-5 sm:text-base">{submitting ? 'Sjekker…' : 'Send svar'}</button>
      </form>
      <p id={feedbackId} role="status" className="mt-3 min-h-6 text-sm text-amber-200">
        {submitting
          ? remainingMs === 0
            ? 'Svaret ble sendt i tide. Venter på serveren…'
            : 'Sjekker svaret…'
          : requestError ?? (wrongAttempts > 0 ? 'Ikke treff. 0 poeng. Prøv igjen før tiden går ut!' : 'Du kan prøve flere ganger innen 10 sekunder.')}
      </p>
    </div>
  );
};
