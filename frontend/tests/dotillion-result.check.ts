import test from 'node:test';
import assert from 'node:assert/strict';
import { createDotillionHandler } from '../api/dotillion';
import type { DotillionCompletion } from '../api/dodle';
import { submitDotillionResult } from '../src/pages/AdventPage/days/2026-12-09/resultApi';

const submission = {
  id: 'a23deed9-1234-4a45-8b67-123456789abc',
  name: ' Test Spiller ',
  mobile: '91234567',
  score: 145,
};

test('result submission forwards name, mobile and score to the existing storage function', async (t) => {
  const saved: DotillionCompletion[] = [];
  const handler = createDotillionHandler(async (result) => {
    saved.push(result);
  });
  t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit) => {
    assert.equal(url, '/api/dotillion');
    let status = 200;
    let body: unknown;
    await handler(
      { method: init.method, body: init.body },
      {
        setHeader() {},
        status(code) {
          status = code;
          return this;
        },
        json(value) {
          body = value;
        },
      },
    );
    return Response.json(body, { status });
  });
  await submitDotillionResult(submission);
  assert.equal(saved.length, 1);
  assert.deepEqual(saved[0], {
    ...submission,
    name: 'Test Spiller',
    mobile: '+4791234567',
    challenge: 'dotillion-2026-12-09',
    completed: true,
    completedAt: saved[0].completedAt,
  });
  assert(Number.isFinite(Date.parse(saved[0].completedAt)));
});

test('zero points are saved; malformed results and failed storage are rejected', async () => {
  const saved: DotillionCompletion[] = [];
  const handler = createDotillionHandler(async (result) => {
    saved.push(result);
  });
  let status = 200;
  let body: unknown;
  const response = {
    setHeader() {},
    status(code: number) {
      status = code;
      return this;
    },
    json(value: unknown) {
      body = value;
    },
  };
  await handler(
    { method: 'POST', body: { ...submission, score: 0 } },
    response,
  );
  assert.equal(status, 200);
  assert.equal(saved[0].score, 0);
  for (const invalid of [
    null,
    '{',
    { ...submission, score: -1 },
    { ...submission, mobile: '123' },
    { ...submission, id: '../other' },
  ]) {
    await handler({ method: 'POST', body: invalid }, response);
    assert.equal(status, 400);
  }
  assert.equal(saved.length, 1);
  await createDotillionHandler(async () => {
    throw new Error('offline');
  })({ method: 'POST', body: submission }, response);
  assert.equal(status, 503);
  assert.deepEqual(body, {
    error: 'Resultatet ble ikke lagret. Kunne ikke kontakte serveren.',
  });
});

test('the client only reports success after the server confirms storage', async (t) => {
  for (const response of [
    Response.json({ saved: false }),
    Response.json({ error: 'offline' }, { status: 503 }),
    new Response('invalid'),
  ]) {
    const fetch = t.mock.method(globalThis, 'fetch', async () => response);
    await assert.rejects(submitDotillionResult(submission), /ikke lagret/);
    fetch.mock.restore();
  }
});
