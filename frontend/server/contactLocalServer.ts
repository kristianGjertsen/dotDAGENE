import express from 'express';
import { createContactHandler, createResendClient, type EmailClient } from '../api/contact.ts';

const app = express();
const port = Number(process.env.CONTACT_API_PORT || 3001);

app.use(express.json());

const mockEmailClient: EmailClient = {
  async send(payload) {
    console.log('[mock-email]', JSON.stringify(payload, null, 2));
    return { id: 'local-mock' };
  },
};

function createLocalEmailClient(): EmailClient {
  const testEmail = process.env.LOCAL_TEST_EMAIL;
  const useLiveTest = process.env.LOCAL_EMAIL_MODE === 'live-test';

  if (!useLiveTest) {
    return mockEmailClient;
  }

  if (!process.env.RESEND_API_KEY || !testEmail) {
    console.warn('LOCAL_EMAIL_MODE=live-test krever RESEND_API_KEY og LOCAL_TEST_EMAIL. Bruker mock-email.');
    return mockEmailClient;
  }

  const resendClient = createResendClient();

  return {
    send(payload) {
      return resendClient.send({
        ...payload,
        to: [testEmail],
        subject: `[LOCAL TEST] ${payload.subject}`,
      });
    },
  };
}

const contactHandler = createContactHandler(createLocalEmailClient());

app.post('/api/contact', (req, res) => {
  void contactHandler(req, res);
});

app.listen(port, () => {
  const mode = process.env.LOCAL_EMAIL_MODE === 'live-test' ? 'live-test' : 'mock-email';
  console.log(`Contact API kjører på http://localhost:${port}/api/contact (${mode})`);
});
