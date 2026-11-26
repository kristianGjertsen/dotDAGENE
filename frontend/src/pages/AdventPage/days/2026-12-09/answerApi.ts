export const VERCEL_ANSWER_URL = '/api/check-word';

export interface AnswerResult {
  valid: boolean;
  score: number;
}

function isAnswerResult(value: unknown): value is AnswerResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as Record<string, unknown>;
  return typeof result.valid === 'boolean' &&
    typeof result.score === 'number' && Number.isFinite(result.score) &&
    result.score >= 0 && (result.valid || result.score === 0);
}

export async function submitAnswerToVercel(
  questionId: number,
  answer: string,
  signal?: AbortSignal,
): Promise<AnswerResult> {
  const response = await fetch(VERCEL_ANSWER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questionId, word: answer.trim() }),
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(10_000)])
      : AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw new Error('Kunne ikke sjekke svaret. Prøv igjen.');

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error('Ugyldig svar fra serveren. Prøv igjen.');
  }

  if (!isAnswerResult(result)) throw new Error('Ugyldig svar fra serveren. Prøv igjen.');
  return result;
}
