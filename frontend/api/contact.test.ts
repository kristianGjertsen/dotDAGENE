import assert from 'node:assert/strict';
import test from 'node:test';
import { Readable } from 'node:stream';
import { createContactHandler, type EmailClient } from './contact.ts';

type MockResponse = {
  statusCode: number;
  body: unknown;
  ended: boolean;
  status: (code: number) => MockResponse;
  json: (body: unknown) => MockResponse;
  end: () => MockResponse;
};

function createResponse(): MockResponse {
  return {
    statusCode: 200,
    body: undefined,
    ended: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
}

function createMockClient() {
  const sent: Parameters<EmailClient['send']>[0][] = [];
  const client: EmailClient = {
    async send(payload) {
      sent.push(payload);
      return { id: `test-${sent.length}` };
    },
  };

  return { client, sent };
}

const validPayload = {
  bedriftsnavn: 'Testbedrift AS',
  kontaktperson: 'Kari Nordmann',
  stilling: 'HR-leder',
  epost: 'kari@testbedrift.no',
  melding: 'Vi vil gjerne vite mer om stands.',
};

test('sender intern e-post og kvittering ved gyldig innsending', async () => {
  const { client, sent } = createMockClient();
  const handler = createContactHandler(client);
  const res = createResponse();

  await handler({ method: 'POST', body: validPayload }, res);

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
  assert.equal(sent.length, 2);
  assert.equal(sent[0].to[0], 'kontakt@dotdagene.no');
  assert.equal(sent[0].replyTo, validPayload.epost);
  assert.equal(sent[0].subject, 'Henvendelse fra Testbedrift AS');
  assert.match(sent[0].text, /Kontaktperson: Kari Nordmann/);
  assert.equal(sent[1].to[0], validPayload.epost);
  assert.equal(sent[1].subject, 'Vi har mottatt henvendelsen din');
  assert.match(sent[1].text, /Takk for henvendelsen om Testbedrift AS/);
});

test('godtar JSON-body fra request stream slik Vercel kan levere den', async () => {
  const { client, sent } = createMockClient();
  const handler = createContactHandler(client);
  const req = Readable.from([JSON.stringify(validPayload)]);
  const res = createResponse();

  Object.assign(req, { method: 'POST' });
  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(sent.length, 2);
});

test('avviser manglende obligatoriske felt uten å sende e-post', async () => {
  const { client, sent } = createMockClient();
  const handler = createContactHandler(client);
  const res = createResponse();

  await handler({ method: 'POST', body: { ...validPayload, epost: '' } }, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Mangler felt' });
  assert.equal(sent.length, 0);
});

test('avviser ugyldig e-post uten å sende e-post', async () => {
  const { client, sent } = createMockClient();
  const handler = createContactHandler(client);
  const res = createResponse();

  await handler({ method: 'POST', body: { ...validPayload, epost: 'ikke-en-epost' } }, res);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { error: 'Ugyldig e-post' });
  assert.equal(sent.length, 0);
});

test('avviser andre HTTP-metoder', async () => {
  const { client, sent } = createMockClient();
  const handler = createContactHandler(client);
  const res = createResponse();

  await handler({ method: 'GET', body: validPayload }, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.ended, true);
  assert.equal(sent.length, 0);
});

test('returnerer 500 hvis e-postleverandoren feiler', async () => {
  const originalConsoleError = console.error;
  console.error = () => {};
  const handler = createContactHandler({
    async send() {
      throw new Error('Resend failed');
    },
  });
  const res = createResponse();

  try {
    await handler({ method: 'POST', body: validPayload }, res);
  } finally {
    console.error = originalConsoleError;
  }

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, { error: 'Internal error' });
});
