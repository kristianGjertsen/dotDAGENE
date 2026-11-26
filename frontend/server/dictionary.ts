import { normalizeWord } from '../src/pages/AdventPage/days/2026-11-29/logic';

export async function isValidWord(
  word: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  const normalized = normalizeWord(word);
  if (!/^[a-zæøå]{5}$/.test(normalized)) return false;

  const response = await fetcher(
    `https://ord.uib.no/api/articles?w=${encodeURIComponent(normalized)}&dict=bm&scope=ei`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!response.ok) throw new Error('Dictionary unavailable');
  const data: unknown = await response.json();
  // Exact headwords (e) and inflected forms (i), never fuzzy suggestions.
  const articles = (data as { articles?: { bm?: unknown } } | null)?.articles
    ?.bm;
  if (!Array.isArray(articles))
    throw new Error('Unexpected dictionary response');
  return articles.length > 0;
}
