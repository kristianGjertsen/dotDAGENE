import { get } from '@vercel/blob';
import { normalizeWord } from '../src/pages/AdventPage/days/2026-11-29/logic';

export const DODLE_WORDS_PATH = 'dodle/words/words.json';

export function parseDodleWords(data: unknown): string[] {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('words.json must contain a non-empty array of words');
  }
  const words = data.map((word: unknown) => {
    if (typeof word !== 'string') throw new Error('Invalid word in words.json');
    const normalized = normalizeWord(word);
    if (!/^[a-zæøå]{5}$/.test(normalized))
      throw new Error('All answers must have five Norwegian letters');
    return normalized;
  });
  return [...new Set(words)];
}

export async function loadDodleWords(
  config = {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    access: process.env.DODLE_BLOB_ACCESS,
  },
  readBlob: typeof get = get,
): Promise<string[]> {
  const blob = await readBlob(DODLE_WORDS_PATH, {
    token: config.token,
    access: config.access === 'public' ? 'public' : 'private',
    useCache: false,
    abortSignal: AbortSignal.timeout(8000),
  });
  if (!blob || blob.statusCode !== 200)
    throw new Error('Dodle words.json not found');
  return parseDodleWords(await new Response(blob.stream).json());
}
