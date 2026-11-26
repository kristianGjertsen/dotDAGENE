import test from 'node:test';
import assert from 'node:assert/strict';
import { createCheckWordHandler } from '../api/check-word';
import { submitAnswerToVercel } from '../src/pages/AdventPage/days/2026-12-09/answerApi';
import { CORRECT_DROP, gameReducer, initialGame, questions } from '../src/pages/AdventPage/days/2026-12-09/dotillionGame';

function startQuestion() {
  const started = gameReducer(initialGame, { type: 'start', name: 'Test', mobile: '91234567' });
  return gameReducer(started, { type: 'landed', now: 1000 });
}

test('submission uses the check-word contract and awards the returned score', async (t) => {
  const handler = createCheckWordHandler(async () => [{
    id: 1,
    question: 'Test',
    answers: { common: ['test-æ'], rare: [], one_in_a_dotillion: [] },
    points: { common: 37, rare: 62, one_in_a_dotillion: 101 },
  }]);
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, '/api/check-word');
    assert.equal(init.method, 'POST');
    assert.deepEqual(JSON.parse(init.body as string), { questionId: 1, word: 'TEST-Æ' });
    let status = 200;
    let body: unknown;
    await handler({ method: init.method, body: init.body }, {
      setHeader() {},
      status(code) { status = code; return this; },
      json(value) { body = value; },
    });
    return Response.json(body, { status });
  });

  const result = await submitAnswerToVercel(questions[0].id, '  TEST-Æ  ');
  assert.deepEqual(result, { valid: true, score: 37 });
  const state = startQuestion();
  const pending = gameReducer(state, { type: 'answer_submitted', requestId: 1, submittedAt: 2000, questionIndex: 0 });
  const finished = gameReducer(pending, { type: 'answer_result', requestId: 1, result, now: 3000, questionIndex: 0 });
  assert.equal(finished.phase, 'lowering');
  assert.equal(finished.score, 37);
  assert.equal(finished.depth, state.depth + CORRECT_DROP);
  assert.deepEqual(finished.results, [result]);
});

test('no match allows retries without awarding points or resetting the deadline', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ valid: false, score: 0 }));
  const result = await submitAnswerToVercel(1, 'no match');
  const state = startQuestion();
  const pending = gameReducer(state, { type: 'answer_submitted', requestId: 1, submittedAt: 2000, questionIndex: 0 });
  const retry = gameReducer(pending, { type: 'answer_result', requestId: 1, result, now: 3000, questionIndex: 0 });
  assert.equal(retry.phase, 'question');
  assert.equal(retry.score, 0);
  assert.equal(retry.wrongAttempts, 1);
  assert.equal(retry.questionDeadline, state.questionDeadline);
  assert.equal(retry.pendingSubmission, null);
});

test('timely submissions count after the deadline and duplicate responses cannot score twice', () => {
  const state = startQuestion();
  const pending = gameReducer(state, { type: 'answer_submitted', requestId: 1, submittedAt: 10_999, questionIndex: 0 });
  const waiting = gameReducer(pending, { type: 'tick', now: 11_000, questionIndex: 0 });
  assert.equal(waiting.phase, 'question');
  assert.equal(waiting.secondsLeft, 0);
  const action = { type: 'answer_result' as const, requestId: 1, result: { valid: true, score: 62 }, now: 12_000, questionIndex: 0 };
  const finished = gameReducer(waiting, action);
  assert.equal(finished.score, 62);
  assert.equal(gameReducer(finished, action), finished);
});

test('a match is determined by valid even when its score is zero', () => {
  const state = startQuestion();
  const pending = gameReducer(state, { type: 'answer_submitted', requestId: 1, submittedAt: 2000, questionIndex: 0 });
  const finished = gameReducer(pending, { type: 'answer_result', requestId: 1, result: { valid: true, score: 0 }, now: 3000, questionIndex: 0 });
  assert.equal(finished.phase, 'lowering');
  assert.equal(finished.depth, state.depth + CORRECT_DROP);
  assert.equal(finished.score, 0);
});

test('server failures and malformed responses are errors, not missed answers', async (t) => {
  for (const body of ['common', null, {}, { valid: true, score: '37' }, { valid: false, score: 37 }, { valid: true, score: -1 }]) {
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(body));
    await assert.rejects(submitAnswerToVercel(1, 'test'), /Ugyldig svar/);
    fetch.mock.restore();
  }
  const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'offline' }, { status: 503 }));
  await assert.rejects(submitAnswerToVercel(1, 'test'), /Kunne ikke sjekke/);
  fetch.mock.restore();
  t.mock.method(globalThis, 'fetch', async () => new Response('<html>error</html>'));
  await assert.rejects(submitAnswerToVercel(1, 'test'), /Ugyldig svar/);

  const state = startQuestion();
  const pending = gameReducer(state, { type: 'answer_submitted', requestId: 1, submittedAt: 2000, questionIndex: 0 });
  const retry = gameReducer(pending, { type: 'request_failed', requestId: 1, now: 3000, questionIndex: 0 });
  assert.equal(retry.wrongAttempts, 0);
  assert.equal(retry.pendingSubmission, null);
  assert.equal(retry.score, 0);
});
