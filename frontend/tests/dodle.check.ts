import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreGuess } from '../src/pages/AdventPage/days/2026-11-29/logic';
import { WORDS } from '../src/pages/AdventPage/days/2026-11-29/words';
import { playDodle, encrypt, decrypt, type Completion } from '../server/dodle';
const secret = 'local-test-secret';

test('word list and duplicate-letter scoring', () => {
  assert.equal(WORDS.length, 100);
  assert(WORDS.every((word) => [...word].length === 5));
  assert.deepEqual(scoreGuess('nisse', 'nisse'), Array(5).fill('correct'));
  assert.deepEqual(scoreGuess('kaker', 'pakke'), [
    'present',
    'correct',
    'correct',
    'present',
    'absent',
  ]);
  assert.deepEqual(scoreGuess('nisse', 'smile'), [
    'absent',
    'present',
    'present',
    'absent',
    'correct',
  ]);
  assert.deepEqual(scoreGuess('snødd', 'snøen'), [
    'correct',
    'correct',
    'correct',
    'absent',
    'absent',
  ]);
});

test('only verified wins are saved; invalid guesses do not use attempts', async () => {
  const saved: Completion[] = [];
  const options = {
    secret,
    answer: 'nisse',
    validateWord: async (word: string) => WORDS.includes(word),
    save: async (result: Completion) => {
      saved.push(result);
    },
  };
  const start = await playDodle(
    { action: 'start', name: ' Test Spiller ' },
    options,
  );
  assert.equal(start.code, 200);
  let token = (start.body as { token: string }).token;
  assert(!JSON.stringify(start.body).includes('nisse'));
  assert.equal(
    (await playDodle({ action: 'complete', token }, options)).code,
    400,
  );
  assert.equal(
    (await playDodle({ action: 'guess', token, word: 'abcde' }, options)).code,
    400,
  );
  const win = await playDodle(
    { action: 'guess', token, word: 'NISSE' },
    options,
  );
  token = (win.body as { token: string }).token;
  assert.equal((win.body as { status: string }).status, 'won');
  assert.equal(
    (await playDodle({ action: 'complete', token }, options)).code,
    200,
  );
  assert.equal(saved.length, 1);
  assert.equal(saved[0].name, 'Test Spiller');
  assert.equal('guesses' in saved[0], false);
  assert.equal(
    (await playDodle({ action: 'guess', token, word: 'nisse' }, options)).code,
    409,
  );
});

test('losses stop at six and are never saved; tampering is rejected', async () => {
  const options = {
    secret,
    answer: 'nisse',
    validateWord: async (word: string) => WORDS.includes(word),
    save: async () => {
      throw new Error('Must not save');
    },
  };
  let result = await playDodle({ action: 'start', name: 'Test' }, options);
  for (let i = 0; i < 6; i++)
    result = await playDodle(
      {
        action: 'guess',
        token: (result.body as { token: string }).token,
        word: 'pakke',
      },
      options,
    );
  const data = result.body as { token: string; status: string; answer: string };
  assert.equal(data.status, 'lost');
  assert.equal(data.answer, 'nisse');
  assert.equal(
    (await playDodle({ action: 'complete', token: data.token }, options)).code,
    400,
  );
  assert.equal(
    (
      await playDodle(
        { action: 'guess', token: 'tampered', word: 'nisse' },
        options,
      )
    ).code,
    400,
  );
  assert.equal(
    (
      await playDodle(
        { action: 'guess', token: data.token, word: 'nisse' },
        options,
      )
    ).code,
    409,
  );
});

test('encrypted result round trip and preview skips storage', async () => {
  const game = {
    id: 'test',
    name: 'Private Name',
    answer: 'nisse',
    guesses: ['nisse'],
    expires: Date.now() + 10000,
  };
  const token = encrypt(game, secret);
  assert(!token.includes(game.name));
  assert.deepEqual(decrypt(token, secret), game);
  assert.throws(() => decrypt(token, 'wrong-key'));
  const result = await playDodle(
    { action: 'complete', token },
    {
      secret,
      preview: true,
      save: async () => {
        throw Error('Must not save');
      },
    },
  );
  assert.deepEqual(result.body, { saved: false, preview: true });
});

test('dictionary words outside the answer list work and failures preserve attempts', async () => {
  const options = { secret, answer: 'nisse', save: async () => {} };
  const start = await playDodle({ action: 'start', name: 'Test' }, options);
  const token = (start.body as { token: string }).token;
  assert(!WORDS.includes('huset'));
  const valid = await playDodle(
    { action: 'guess', token, word: 'HUSET' },
    { ...options, validateWord: async (word) => word === 'huset' },
  );
  assert.equal(valid.code, 200);
  assert.equal((valid.body as { guesses: unknown[] }).guesses.length, 1);
  const unavailable = await playDodle(
    { action: 'guess', token, word: 'huset' },
    {
      ...options,
      validateWord: async () => {
        throw Error('offline');
      },
    },
  );
  assert.equal(unavailable.code, 503);
  assert.equal(decrypt(token, secret).guesses.length, 0);
  const invalid = await playDodle(
    { action: 'guess', token, word: 'abcde' },
    { ...options, validateWord: async () => false },
  );
  assert.equal(invalid.code, 400);
  assert.equal(decrypt(token, secret).guesses.length, 0);
});
