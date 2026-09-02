import assert from 'node:assert/strict';
import test from 'node:test';
import 'dotenv/config';
import { createContactHandler, createResendClient, type ContactResponse, type EmailClient } from './contact.ts';

const liveTestRecipient = process.env.LOCAL_TEST_EMAIL;

type TestResponse = {
  statusCode: number;
  body: unknown;
  status: (code: number) => TestResponse;
  json: (body: unknown) => TestResponse;
  end: () => TestResponse;
};

function createResponse(): TestResponse {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    end() {
      return this;
    },
  };
}

function createLiveTestEmailClient(): EmailClient {
  const resendClient = createResendClient();

  return {
    send(payload) {
      return resendClient.send({
        ...payload,
        to: [liveTestRecipient!],
        subject: `[LOCAL LIVE TEST] ${payload.subject}`,
      });
    },
  };
}

test('sender ekte testmail via Resend til testadressen fra .env', async () => {
  assert.ok(liveTestRecipient, 'LOCAL_TEST_EMAIL må være satt i .env eller miljøet.');
  assert.match(liveTestRecipient, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.ok(process.env.RESEND_API_KEY, 'RESEND_API_KEY må være satt for live-test.');

  const handler = createContactHandler(createLiveTestEmailClient());
  const res = createResponse();

  await handler(
    {
      method: 'POST',
      body: {
        bedriftsnavn: 'dotDAGENE localhost live-test',
        kontaktperson: 'Lokal test',
        stilling: 'Test',
        epost: 'localhost-test@dotdagene.no',
        melding: `Live-test kjørt fra localhost ${new Date().toISOString()}.`,
      },
    },
    res as ContactResponse,
  );

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true });
});
