import { get } from '@vercel/blob';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'dotenv';

export const DOTILLION_QUESTIONS_PATH =
  'dotillion/words/dotillion-questions.json';
const categories = ['one_in_a_dotillion', 'rare', 'common'] as const;
type Category = (typeof categories)[number];
interface Question {
  id: number;
  question: string;
  answers: Record<Category, string[]>;
  points: Record<Category, number>;
}
interface ApiResponse {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponse;
  json(body: unknown): unknown;
}
const normalize = (word: string) =>
  word.normalize('NFC').trim().toLocaleLowerCase('nb-NO');

function isLocalDevelopment() {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.VERCEL_ENV !== 'production' &&
    process.env.VERCEL_ENV !== 'preview'
  );
}

function localBlobToken(): string | undefined {
  if (!isLocalDevelopment()) return undefined;
  // vercel dev does not always inject the env file that Vite loads itself.
  for (const path of [resolve('.env.local'), resolve('frontend/.env.local')]) {
    try {
      const token = parse(readFileSync(path)).BLOB_READ_WRITE_TOKEN;
      if (token) return token;
    } catch {
      /* Try the next local project location. */
    }
  }
  return undefined;
}

function errorDetails(error: unknown) {
  if (!(error instanceof Error)) return 'Ukjent feil';
  if (error instanceof SyntaxError)
    return 'Spørsmålsfilen inneholder ugyldig JSON.';
  let message = error.message;
  for (const secret of [
    process.env.BLOB_READ_WRITE_TOKEN,
    localBlobToken(),
    process.env.VERCEL_OIDC_TOKEN,
  ]) {
    if (secret) message = message.split(secret).join('[skjult]');
  }
  return message.replace(/vercel_blob_[a-zA-Z0-9_-]+/g, '[skjult]');
}

export async function loadDotillionQuestions(
  token = process.env.BLOB_READ_WRITE_TOKEN,
): Promise<Question[]> {
  token = token || localBlobToken();
  if (!token && !process.env.BLOB_STORE_ID) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN mangler. Legg tokenet i frontend/.env.local og start vercel dev på nytt.',
    );
  }
  const blob = await get(DOTILLION_QUESTIONS_PATH, {
    access: 'private',
    token,
    useCache: false,
    abortSignal: AbortSignal.timeout(8000),
  });
  if (!blob || blob.statusCode !== 200)
    throw new Error(
      'Fant ikke dotillion/words/dotillion-questions.json i det tilkoblede Blob-lageret.',
    );
  const data: unknown = await new Response(blob.stream).json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (q) =>
        q &&
        Number.isInteger(q.id) &&
        typeof q.question === 'string' &&
        categories.every(
          (category) =>
            Array.isArray(q.answers?.[category]) &&
            q.answers[category].every(
              (answer: unknown) => typeof answer === 'string',
            ) &&
            Number.isFinite(q.points?.[category]),
        ),
    )
  )
    throw new Error(
      'Spørsmålsfilen må være en liste med id, question, answers og points for alle tre kategorier.',
    );
  return data as Question[];
}

export function createCheckWordHandler(loadQuestions = loadDotillionQuestions) {
  return async (req: { method?: string; body?: unknown }, res: ApiResponse) => {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Bruk POST.' });
    }
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Ugyldig JSON.' });
      }
    }
    const { questionId, word } = (
      body && typeof body === 'object' ? body : {}
    ) as Record<string, unknown>;
    if (
      !Number.isInteger(questionId) ||
      typeof word !== 'string' ||
      !word.trim() ||
      word.length > 200
    ) {
      return res
        .status(400)
        .json({ error: 'Oppgi questionId som heltall og et svar i word.' });
    }
    try {
      const questions = await loadQuestions();
      const question = questions.find((q) => q.id === questionId);
      if (!question)
        return res.status(404).json({ error: 'Spørsmålet finnes ikke.' });
      const normalized = normalize(word);
      for (const category of categories) {
        if (
          question.answers[category].some(
            (answer) => normalize(answer) === normalized,
          )
        ) {
          return res
            .status(200)
            .json({ valid: true, score: question.points[category] });
        }
      }
      return res.status(200).json({ valid: false, score: 0 });
    } catch (error) {
      console.error(
        '[Dotillion] Kunne ikke lese spørsmål fra privat Blob:',
        errorDetails(error),
      );
      return res.status(503).json({
        error: isLocalDevelopment()
          ? `Kunne ikke hente spørsmålene: ${errorDetails(error)}`
          : 'Kunne ikke hente spørsmålene. Sjekk Blob-tilkoblingen og prøv igjen.',
      });
    }
  };
}

export default createCheckWordHandler();
