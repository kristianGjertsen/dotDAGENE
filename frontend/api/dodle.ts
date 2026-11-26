import { put } from '@vercel/blob';
import { publicEntries } from './advent';
import { encrypt, playDodle, type Completion } from '../server/dodle';

export async function saveCompletion(result: Completion) {
  const secret = process.env.DODLE_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  const access =
    process.env.DODLE_BLOB_ACCESS === 'private' ? 'private' : 'public';
  if (!process.env.BLOB_READ_WRITE_TOKEN || !secret)
    throw new Error('Missing Dodle storage configuration');
  // Use one stable path per game so a retry cannot create another entry.
  const data =
    access === 'public'
      ? { encrypted: encrypt(result, secret), version: 1 }
      : result;
  await put(`results/dodle/${result.id}.json`, JSON.stringify(data), {
    access,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

type Response = {
  setHeader(name: string, value: string): void;
  status(code: number): Response;
  json(body: unknown): unknown;
};
export default async function handler(
  req: { method?: string; body?: unknown },
  res: Response,
) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Bruk POST.' });
  }
  if (
    publicEntries().find((entry) => entry.date === '2026-11-29')?.status !==
    'published'
  )
    return res.status(403).json({ error: 'Denne luken er ikke åpen.' });
  const secret = process.env.DODLE_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  if (!secret || !process.env.BLOB_READ_WRITE_TOKEN)
    return res
      .status(503)
      .json({ error: 'Spillet er ikke klart ennå. Prøv igjen senere.' });
  try {
    const result = await playDodle(req.body, { secret, save: saveCompletion });
    return res.status(result.code).json(result.body);
  } catch {
    return res
      .status(503)
      .json({ error: 'Kunne ikke lagre resultatet. Prøv igjen.' });
  }
}
