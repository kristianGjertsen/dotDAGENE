import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ViteDevServer } from 'vite';
import {
  createContactHandler,
  createResendClient,
  type ContactRequest,
  type ContactResponse,
  type EmailClient,
} from './api/contact';

function createDevContactResponse(res: ServerResponse): ContactResponse {
  return {
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(body) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(body));
      return this;
    },
    end() {
      res.end();
      return this;
    },
  };
}

const mockEmailClient: EmailClient = {
  async send(payload) {
    console.log('[mock-email]', JSON.stringify(payload, null, 2));
    return { id: 'local-vite-mock' };
  },
};

function createLocalEmailClient(): EmailClient {
  const testEmail = process.env.LOCAL_TEST_EMAIL;
  const useLiveTest = process.env.LOCAL_EMAIL_MODE === 'live-test';

  if (!useLiveTest) {
    console.log('Contact API bruker mock-email lokalt.');
    return mockEmailClient;
  }

  if (!process.env.RESEND_API_KEY || !testEmail) {
    console.warn('LOCAL_EMAIL_MODE=live-test krever RESEND_API_KEY og LOCAL_TEST_EMAIL. Bruker mock-email.');
    return mockEmailClient;
  }

  const resendClient = createResendClient();
  console.log(`Contact API bruker Resend live-test lokalt. Alle mottakere overskrives til ${testEmail}.`);

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

function localContactApiPlugin() {
  return {
    name: 'local-contact-api',
    configureServer(server: ViteDevServer) {
      const contactHandler = createContactHandler(createLocalEmailClient());

      server.middlewares.use('/api/contact', (req: IncomingMessage, res: ServerResponse) => {
        void contactHandler(req as ContactRequest, createDevContactResponse(res));
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localContactApiPlugin()],
});
