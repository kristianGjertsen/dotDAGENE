import { randomUUID } from 'node:crypto';
import { BlobNotFoundError, head, put } from '@vercel/blob';

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

    const entry: Omit<ContestEntry, 'id'> = {
      name,
      answer,
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
    };

    const blobPath = 'advent-entries/entries.json';

    let existingEntries: ContestEntry[] = [];
    try {
      const metadata = await head(blobPath);
      const response = await fetch(metadata.downloadUrl);
      if (response.ok) {
        const parsed = await response.json();
        if (Array.isArray(parsed)) existingEntries = parsed;
      }
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) {
        console.warn('Could not read existing entries', error);
      }
    }

    existingEntries.push({
      ...entry,
      id: randomUUID(),
    });

    await put(blobPath, JSON.stringify(existingEntries, null, 2), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('contest-entry error', error);
    return res.status(500).json({ error: 'Kunne ikke lagre svaret nå.' });
  }
}
