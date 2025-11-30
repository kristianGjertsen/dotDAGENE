import { randomUUID } from 'node:crypto';
import { put } from '@vercel/blob';

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

    const entry = {
      name,
      answer,
      createdAt: new Date().toISOString(),
      userAgent: req.headers['user-agent'],
    };

    const blobPath = `advent-entries/${new Date()
      .toISOString()
      .slice(0, 10)}-${randomUUID()}.json`;

    await put(blobPath, JSON.stringify(entry, null, 2), {
      access: 'public',
      contentType: 'application/json',
    });

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('contest-entry error', error);
    return res.status(500).json({ error: 'Kunne ikke lagre svaret nå.' });
  }
}
