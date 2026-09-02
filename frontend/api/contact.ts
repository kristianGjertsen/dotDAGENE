import { Resend } from 'resend';

export type ContactRequest = {
  method?: string;
  body?: unknown;
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>;
};

export type ContactResponse = {
  status: (code: number) => ContactResponse;
  json: (body: unknown) => ContactResponse;
  end: () => ContactResponse;
};

type ContactPayload = {
  bedriftsnavn?: string;
  kontaktperson?: string;
  stilling?: string;
  epost?: string;
  melding?: string;
};

type EmailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export type EmailClient = {
  send: (payload: EmailPayload) => Promise<unknown>;
};

async function readBody(req: ContactRequest) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  if (!req[Symbol.asyncIterator]) {
    return {};
  }

  const chunks: Buffer[] = [];
  const stream = req as AsyncIterable<Buffer | string>;
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function validatePayload(body: ContactPayload) {
  const { bedriftsnavn, kontaktperson, stilling, epost } = body;

  if (!bedriftsnavn || !kontaktperson || !stilling || !epost) {
    return 'Mangler felt';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(epost)) {
    return 'Ugyldig e-post';
  }

  return null;
}

function buildEmails(body: Required<Pick<ContactPayload, 'bedriftsnavn' | 'kontaktperson' | 'stilling' | 'epost'>> & Pick<ContactPayload, 'melding'>) {
  const { bedriftsnavn, kontaktperson, stilling, epost, melding } = body;

  return [
    {
      from: 'dotDAGENE <kontakt@dotdagene.no>',
      to: ['kontakt@dotdagene.no'],
      subject: `Henvendelse fra ${bedriftsnavn}`,
      text: `
Bedriftsnavn: ${bedriftsnavn}
Kontaktperson: ${kontaktperson}
Stilling: ${stilling}
E-post: ${epost}

Melding:
${melding || '(tom)'}
`.trim(),
      replyTo: epost,
    },
    {
      from: 'dotDAGENE <kontakt@dotdagene.no>',
      to: [epost],
      subject: 'Vi har mottatt henvendelsen din',
      text: `
Hei ${kontaktperson},

Takk for henvendelsen om ${bedriftsnavn}. Vi tar kontakt så snart vi kan.


Din melding:
${melding || '(ingen melding sendt inn)'}


Hilsen dotDAGENE
`.trim(),
    },
  ];
}

export function createResendClient(): EmailClient {
  const resend = new Resend(process.env.RESEND_API_KEY);

  return {
    send: (payload) => resend.emails.send(payload),
  };
}

export function createContactHandler(emailClient: EmailClient = createResendClient()) {
  return async function handler(req: ContactRequest, res: ContactResponse) {
    try {
      if (req.method !== 'POST') return res.status(405).end();

      let body: ContactPayload;
      try {
        body = await readBody(req);
      } catch {
        return res.status(400).json({ error: 'Ugyldig JSON' });
      }

      const validationError = validatePayload(body || {});
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const emails = buildEmails(
        body as Required<Pick<ContactPayload, 'bedriftsnavn' | 'kontaktperson' | 'stilling' | 'epost'>> &
          Pick<ContactPayload, 'melding'>,
      );

      await emailClient.send(emails[0]);
      await emailClient.send(emails[1]);

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('contact-api error:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  };
}

export default async function handler(req: ContactRequest, res: ContactResponse) {
  return createContactHandler()(req, res);
}
