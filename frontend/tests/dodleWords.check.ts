import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseDodleWords,
  loadDodleWords,
  DODLE_WORDS_PATH,
} from '../server/dodleWords';
import { playDodle, decrypt } from '../server/dodle';

test('Blob word file normalization and validation', () => {
  assert.deepEqual(parseDodleWords([' NISSE ', 'ønske', 'nisse']), [
    'nisse',
    'ønske',
  ]);
  for (const invalid of [[], {}, ['hei'], ['nisse', 5], ['abc12']])
    assert.throws(() => parseDodleWords(invalid));
});

test('load uses the exact Blob pathname and rejects missing files', async () => {
  let path: unknown;
  let options: unknown;
  const reader = (async (p: unknown, o: unknown) => {
    path = p;
    options = o;
    return { statusCode: 200, stream: new Response('["nisse","gaver"]').body };
  }) as Parameters<typeof loadDodleWords>[1];
  assert.deepEqual(
    await loadDodleWords({ token: 'test-token', access: 'private' }, reader),
    ['nisse', 'gaver'],
  );
  assert.equal(path, DODLE_WORDS_PATH);
  assert.equal((options as { access: string }).access, 'private');
  assert.equal((options as { useCache: boolean }).useCache, false);
  await assert.rejects(
    loadDodleWords({ token: 'test', access: 'public' }, async () => null),
  );
});

test('new games draw from Blob and retain that answer on later guesses', async () => {
  const secret = 'test-secret';
  let reads = 0;
  const options = {
    secret,
    save: async () => {},
    loadWords: async () => {
      reads++;
      return ['gaver'];
    },
    validateWord: async () => true,
  };
  const start = await playDodle(
    { action: 'start', mobile: '91234567', name: 'Test' },
    options,
  );
  assert.equal(start.code, 200);
  const token = (start.body as { token: string }).token;
  assert.equal(decrypt(token, secret).answer, 'gaver');
  const win = await playDodle(
    { action: 'guess', token, word: 'gaver' },
    options,
  );
  assert.equal((win.body as { status: string }).status, 'won');
  assert.equal(reads, 1);
});

test('Blob failure does not silently use local words', async () => {
  const result = await playDodle(
    { action: 'start', mobile: '91234567', name: 'Test' },
    {
      secret: 'test',
      save: async () => {},
      loadWords: async () => {
        throw Error('offline');
      },
    },
  );
  assert.equal(result.code, 503);
  assert.equal('token' in result.body, false);
});
