import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidWord } from '../server/dictionary';

test('dictionary uses normalized Bokmål inflection query and handles empty matches', async () => {
  let requested = '';
  const fetcher: typeof fetch = async (url) => {
    requested = String(url);
    return new Response(JSON.stringify({ articles: { bm: [42738] } }));
  };
  assert.equal(await isValidWord(' ØNSKE ', fetcher), true);
  const url = new URL(requested);
  assert.equal(url.origin, 'https://ord.uib.no');
  assert.equal(url.searchParams.get('w'), 'ønske');
  assert.equal(url.searchParams.get('dict'), 'bm');
  assert.equal(url.searchParams.get('scope'), 'ei');
  assert.equal(
    await isValidWord(
      'abcde',
      async () => new Response('{"articles":{"bm":[]}}'),
    ),
    false,
  );
});

test('malformed words never call the dictionary', async () => {
  const fetcher: typeof fetch = async () => {
    throw Error('Unexpected request');
  };
  for (const word of ['hei', '12345', 'abc-d', 'abcdef'])
    assert.equal(await isValidWord(word, fetcher), false);
});

test('dictionary network, HTTP and malformed response errors remain errors', async () => {
  await assert.rejects(
    isValidWord('huset', async () => {
      throw Error('offline');
    }),
  );
  await assert.rejects(
    isValidWord('huset', async () => new Response('', { status: 503 })),
  );
  await assert.rejects(isValidWord('huset', async () => new Response('{}')));
  await assert.rejects(
    isValidWord('huset', async () => new Response('not json')),
  );
});
