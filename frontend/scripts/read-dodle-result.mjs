// Download a result JSON from Vercel Blob first, then run this script locally.
import { readFile } from 'node:fs/promises';
import { createDecipheriv, createHash } from 'node:crypto';
import 'dotenv/config';

const path = process.argv[2];
if (!path) throw new Error('Bruk: node scripts/read-dodle-result.mjs resultat.json');
const result = JSON.parse(await readFile(path, 'utf8'));
if (!result.encrypted) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const secret = process.env.DODLE_SECRET || process.env.BLOB_READ_WRITE_TOKEN;
  if (!secret) throw new Error('Sett DODLE_SECRET eller BLOB_READ_WRITE_TOKEN i miljøet.');
  const data = Buffer.from(result.encrypted, 'base64url');
  const cipher = createDecipheriv('aes-256-gcm', createHash('sha256').update(secret).digest(), data.subarray(0, 12));
  cipher.setAuthTag(data.subarray(12, 28));
  const text = Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]).toString('utf8');
  console.log(JSON.stringify(JSON.parse(text), null, 2));
}
