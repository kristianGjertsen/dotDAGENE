import entries from '../content/advent.json';
import type { AdventEntry } from '../src/pages/AdventPage/types';

// Draft content stays on the server, including after its calendar date.
export function publicEntries(source = entries): AdventEntry[] {
  return source.map((entry) => {
    if (
      !['published', 'finished'].includes(entry.status) ||
      !entry.title.trim() ||
      !entry.description.trim()
    ) {
      return { date: entry.date, status: 'coming' };
    }
    const link = /^(https?:\/\/|\/(?!\/))/.test(entry.link)
      ? entry.link
      : undefined;
    return {
      date: entry.date,
      status: entry.status as 'published' | 'finished',
      title: entry.title,
      description: entry.description,
      ...(entry.status === 'published' && link
        ? { link, linkLabel: entry.linkLabel || 'Delta her' }
        : {}),
    };
  });
}

type Response = {
  setHeader(name: string, value: string): void;
  status(code: number): Response;
  json(body: unknown): unknown;
};

export default function handler(req: { method?: string }, res: Response) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json(publicEntries());
}
