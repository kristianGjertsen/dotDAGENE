import { randomUUID } from 'node:crypto';
import { kv } from '@vercel/kv';
import { promises as fs } from 'node:fs';
import path from 'node:path';

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

    const hasKvCredentials =
      process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

    let storage: 'kv' | 'local' = 'kv';

    if (!hasKvCredentials) {
      await appendToLocalFile(entry);
      storage = 'local';
    } else {
      await kv.rpush('advent-calendar:entries', JSON.stringify(entry));
    }

    return res.status(201).json({ ok: true, storage });
  } catch (error) {
    console.error('contest-entry error', error);
    return res.status(500).json({ error: 'Kunne ikke lagre svaret nå.' });
  }
}

async function appendToLocalFile(entry: ContestEntry) {
  const dir = path.resolve(process.cwd(), '.data');
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, 'contest-entries.json');

  let existing: ContestEntry[] = [];
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      existing = parsed;
    }
  } catch {
    existing = [];
  }

  existing.push(entry);
  await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf8');
}
