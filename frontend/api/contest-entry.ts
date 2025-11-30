import { randomUUID } from 'node:crypto';
import { list, put } from '@vercel/blob';

type ContestEntry = {
  id: string;
  name: string;
  answer: string;
  createdAt: string;
  userAgent?: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    let body: any = req.body;
    if (!body) {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    } else if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const name = (body?.name ?? '').trim();
    const answer = (body?.answer ?? '').trim();

    if (!name || !answer) {
      return res.status(400).json({ error: 'Navn og svar må fylles ut.' });
    }

    const entry: ContestEntry = {
      id: randomUUID(),
      name,
      answer,
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
    };

    const singleEntryPath = `advent-entries/entries/${entry.id}.json`;
    const combinedEntriesPath = 'advent-entries/entries.json';
    const entriesPrefix = 'advent-entries/entries/';

    await put(singleEntryPath, JSON.stringify(entry, null, 2), {
      access: 'public',
      contentType: 'application/json',
      cacheControlMaxAge: 0,
    });

    try {
      const combinedEntries: ContestEntry[] = [];
      let cursor: string | undefined;

      do {
        const result = await list({ prefix: entriesPrefix, cursor });
        const chunkEntries = await Promise.all(
          result.blobs.map(async (blob) => {
            const response = await fetch(blob.downloadUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Kunne ikke hente blob ${blob.pathname}`);
            const parsed = await response.json();
            return parsed as ContestEntry;
          }),
        );

        combinedEntries.push(...chunkEntries);
        cursor = result.cursor;
      } while (cursor);

      await put(combinedEntriesPath, JSON.stringify(combinedEntries, null, 2), {
        access: 'public',
        contentType: 'application/json',
        cacheControlMaxAge: 0,
        allowOverwrite: true,
      });
    } catch (error) {
      console.error('Could not update combined entries blob', error);
    }

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('contest-entry error', error);
    return res.status(500).json({ error: 'Kunne ikke lagre svaret nå.' });
  }
}
