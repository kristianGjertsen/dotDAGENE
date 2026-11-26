import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  randomInt,
  randomUUID,
} from 'node:crypto';
import { WORDS } from '../src/pages/AdventPage/days/2026-11-29/words';
import { isValidWord } from './dictionary';
import {
  MAX_ATTEMPTS,
  normalizeWord,
  scoreGuess,
} from '../src/pages/AdventPage/days/2026-11-29/logic';

export interface Game {
  id: string;
  name: string;
  answer: string;
  guesses: string[];
  expires: number;
}
export interface Completion {
  id: string;
  name: string;
  challenge: 'dodle-2026-11-29';
  completed: true;
  completedAt: string;
}
export function encrypt(value: unknown, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    'aes-256-gcm',
    createHash('sha256').update(secret).digest(),
    iv,
  );
  const body = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString('base64url');
}
export function decrypt(token: string, secret: string): Game {
  const data = Buffer.from(token, 'base64url');
  const cipher = createDecipheriv(
    'aes-256-gcm',
    createHash('sha256').update(secret).digest(),
    data.subarray(0, 12),
  );
  cipher.setAuthTag(data.subarray(12, 28));
  const game: Game = JSON.parse(
    Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]).toString(
      'utf8',
    ),
  );
  if (game.expires < Date.now()) throw new Error('expired');
  return game;
}
export function gameView(game: Game, secret: string) {
  const won = game.guesses.at(-1) === game.answer;
  const lost = !won && game.guesses.length >= MAX_ATTEMPTS;
  return {
    token: encrypt(game, secret),
    name: game.name,
    guesses: game.guesses.map((word) => ({
      word,
      scores: scoreGuess(word, game.answer),
    })),
    status: won ? 'won' : lost ? 'lost' : 'playing',
    ...(lost ? { answer: game.answer } : {}),
  };
}
export async function playDodle(
  body: unknown,
  options: {
    secret: string;
    save: (result: Completion) => Promise<void>;
    preview?: boolean;
    answer?: string;
    validateWord?: (word: string) => Promise<boolean>;
  },
) {
  if (!body || typeof body !== 'object')
    return { code: 400, body: { error: 'Ugyldig forespørsel.' } };
  const input = body as Record<string, unknown>;
  if (input.action === 'start') {
    const name =
      typeof input.name === 'string'
        ? input.name.trim().replace(/\s+/g, ' ')
        : '';
    if (!name || name.length > 80 || /[\x00-\x1f<>]/.test(name))
      return { code: 400, body: { error: 'Skriv inn et navn på 1–80 tegn.' } };
    const game: Game = {
      id: randomUUID(),
      name,
      answer: options.answer ?? WORDS[randomInt(WORDS.length)],
      guesses: [],
      expires: Date.now() + 24 * 60 * 60 * 1000,
    };
    return { code: 200, body: gameView(game, options.secret) };
  }
  let game: Game;
  try {
    if (typeof input.token !== 'string' || input.token.length > 6000)
      throw new Error('invalid');
    game = decrypt(input.token, options.secret);
  } catch {
    return {
      code: 400,
      body: { error: 'Spillet er utløpt eller ugyldig. Start et nytt spill.' },
    };
  }
  if (input.action === 'complete') {
    if (game.guesses.at(-1) !== game.answer)
      return {
        code: 400,
        body: { error: 'Du må løse ordet før resultatet kan sendes inn.' },
      };
    if (!options.preview)
      await options.save({
        id: game.id,
        name: game.name,
        challenge: 'dodle-2026-11-29',
        completed: true,
        completedAt: new Date().toISOString(),
      });
    return {
      code: 200,
      body: { saved: !options.preview, preview: !!options.preview },
    };
  }
  if (input.action !== 'guess')
    return { code: 400, body: { error: 'Ukjent handling.' } };
  if (
    game.guesses.length >= MAX_ATTEMPTS ||
    game.guesses.at(-1) === game.answer
  )
    return { code: 409, body: { error: 'Spillet er allerede ferdig.' } };
  const word = typeof input.word === 'string' ? normalizeWord(input.word) : '';
  if (!/^[a-zæøå]{5}$/.test(word))
    return {
      code: 400,
      body: { error: 'Skriv et norsk ord på fem bokstaver.' },
    };
  try {
    if (!(await (options.validateWord ?? isValidWord)(word))) {
      return {
        code: 400,
        body: {
          error: 'Ordet finnes ikke i den norske ordboken. Prøv et annet.',
        },
      };
    }
  } catch {
    return {
      code: 503,
      body: {
        error:
          'Ordboken er utilgjengelig akkurat nå. Prøv igjen. Forsøket er ikke brukt.',
      },
    };
  }
  game.guesses.push(word);
  return { code: 200, body: gameView(game, options.secret) };
}
