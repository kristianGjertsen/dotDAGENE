import test from 'node:test';
import assert from 'node:assert/strict';
import { createCheckWordHandler } from '../api/check-word';
// Synthetic fixtures, not answers from the private question file.
const questions = [
  {
    id: 1,
    question: 'Test',
    answers: {
      one_in_a_dotillion: ['test-æ'],
      rare: ['test-b'],
      common: ['test-c'],
    },
    points: { one_in_a_dotillion: 100, rare: 50, common: 10 },
  },
];
async function call(
  body: unknown,
  method = 'POST',
  load = async () => questions,
) {
  let status = 200;
  let result: unknown;
  const headers: Record<string, string> = {};
  await createCheckWordHandler(load)(
    { method, body },
    {
      setHeader(name, value) {
        headers[name] = value;
      },
      status(code) {
        status = code;
        return this;
      },
      json(body) {
        result = body;
      },
    },
  );
  return { status, result, headers };
}
test('matching is normalized and all score categories work without exposing answers', async () => {
  for (const [word, score] of [
    [' TEST-Æ ', 100],
    ['test-b', 50],
    ['test-c', 10],
  ] as const) {
    const response = await call({ questionId: 1, word });
    assert.equal(response.status, 200);
    assert.deepEqual(response.result, { valid: true, score });
  }
  assert.deepEqual(
    (await call({ questionId: 1, word: 'not-a-match' })).result,
    { valid: false, score: 0 },
  );
});
test('input, missing questions, JSON and methods are handled', async () => {
  for (const body of [
    null,
    {},
    '{',
    { questionId: '1', word: 'x' },
    { questionId: 1, word: ' ' },
  ])
    assert.equal((await call(body)).status, 400);
  assert.equal((await call({ questionId: 99, word: 'test' })).status, 404);
  assert.equal((await call(undefined, 'GET')).status, 405);
  assert.equal(
    (await call(JSON.stringify({ questionId: 1, word: 'test-c' }))).status,
    200,
  );
});
test('Blob errors do not pretend the word is invalid', async () => {
  const response = await call(
    { questionId: 1, word: 'test' },
    'POST',
    async () => {
      throw Error('offline');
    },
  );
  assert.equal(response.status, 503);
  assert.equal(response.headers['Cache-Control'], 'no-store');
});
