import { normalizeWord } from '../src/pages/AdventPage/days/2026-11-29/logic';

export async function isValidWord(
  word: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const normalized = normalizeWord(word);
  if (!/^[a-zæøå]{5}$/.test(normalized)) return false;

  const response = await fetcher(
    `https://ordbank.uib.no/api/lemmas?query=${encodeURIComponent(normalized)}&language=nob&search_inflection=true`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!response.ok) throw new Error('Dictionary unavailable');
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error('Unexpected dictionary response');
  return data.length > 0;
}
