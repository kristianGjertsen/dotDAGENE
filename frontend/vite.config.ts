import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ViteDevServer } from 'vite';
import { publicEntries } from './api/advent';
import { randomBytes } from 'node:crypto';
import { playDodle } from './server/dodle';
import { saveCompletion } from './api/dodle';
import { loadDodleWords } from './server/dodleWords';
import {
  createCheckWordHandler,
  loadDotillionQuestions,
} from './api/check-word';
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
    console.warn(
      'LOCAL_EMAIL_MODE=live-test krever RESEND_API_KEY og LOCAL_TEST_EMAIL. Bruker mock-email.',
    );
    return mockEmailClient;
  }

  const resendClient = createResendClient();
  console.log(
    `Contact API bruker Resend live-test lokalt. Alle mottakere overskrives til ${testEmail}.`,
  );

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
      const env = {
        ...loadEnv(server.config.mode, server.config.envDir, ''),
        ...process.env,
      };
      const blobConfig = {
        token: env.BLOB_READ_WRITE_TOKEN,
        secret: env.DODLE_SECRET || env.BLOB_READ_WRITE_TOKEN,
        access: env.DODLE_BLOB_ACCESS,
      };
      const dodlePreviewSecret =
        blobConfig.secret || randomBytes(32).toString('hex');
      console.info(
        `[Dodle] Blob-lagring: ${blobConfig.token ? 'tilkoblet' : 'mangler BLOB_READ_WRITE_TOKEN i frontend/.env.local'}`,
      );
      const checkWord = createCheckWordHandler(() =>
        loadDotillionQuestions(blobConfig.token),
      );
      server.middlewares.use('/api/check-word', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const response = {
          setHeader(name: string, value: string) {
            res.setHeader(name, value);
          },
          status(code: number) {
            res.statusCode = code;
            return this;
          },
          json(body: unknown) {
            res.end(JSON.stringify(body));
          },
        };
        if (req.method !== 'POST') {
          await checkWord({ method: req.method }, response);
          return;
        }
        try {
          let raw = '';
          for await (const chunk of req) {
            raw += chunk.toString();
            if (raw.length > 4096) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'For stor forespørsel.' }));
              return;
            }
          }
          await checkWord({ method: req.method, body: raw }, response);
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Kunne ikke lese forespørselen.' }));
        }
      });
      server.middlewares.use('/api/dodle', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Bruk POST.' }));
          return;
        }
        try {
          let raw = '';
          for await (const chunk of req) {
            raw += chunk.toString();
            if (raw.length > 12000) {
              res.statusCode = 413;
              res.end(JSON.stringify({ error: 'For stor forespørsel.' }));
              return;
            }
          }
          const input = JSON.parse(raw);
          if (input.action === 'complete' && !blobConfig.token) {
            console.error(
              '[Dodle] Innsending avvist: BLOB_READ_WRITE_TOKEN mangler lokalt.',
            );
            res.statusCode = 503;
            res.end(
              JSON.stringify({
                error:
                  'Resultatet er IKKE lagret. Legg BLOB_READ_WRITE_TOKEN i frontend/.env.local og start serveren på nytt.',
              }),
            );
            return;
          }
          const result = await playDodle(input, {
            secret: dodlePreviewSecret,
            loadWords: () => loadDodleWords(blobConfig),
            save: (result) => saveCompletion(result, blobConfig),
          });
          if (input.action === 'complete')
            console.info(
              '[Dodle] Innsending:',
              result.code === 200 ? 'lagret' : 'avvist',
            );
          res.statusCode = result.code;
          res.end(JSON.stringify(result.body));
        } catch (error) {
          console.error(
            '[Dodle] Forespørsel feilet:',
            error instanceof Error ? error.name : 'Unknown error',
          );
          res.statusCode = 503;
          res.end(
            JSON.stringify({
              error:
                'Resultatet er ikke lagret. Sjekk Blob-token og tilgangstype. Prøv igjen.',
            }),
          );
        }
      });
      server.middlewares.use('/api/advent', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify(publicEntries()));
      });
      const contactHandler = createContactHandler(createLocalEmailClient());

      server.middlewares.use(
        '/api/contact',
        (req: IncomingMessage, res: ServerResponse) => {
          void contactHandler(
            req as ContactRequest,
            createDevContactResponse(res),
          );
        },
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localContactApiPlugin()],
});
