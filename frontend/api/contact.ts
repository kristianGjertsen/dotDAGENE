import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') return res.status(405).end();

    let body: any = req.body;
    if (!body) {
      // Vercel Node kan gi en stream
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    } else if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    const { bedriftsnavn, kontaktperson, stilling, epost, melding } = body || {};

    // Valider felter
    if (!bedriftsnavn || !kontaktperson || !stilling || !epost) {
      return res.status(400).json({ error: 'Mangler felt' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(epost)) {
      return res.status(400).json({ error: 'Ugyldig e-post' });
    }

    // Send e-post til oss
    await resend.emails.send({
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
    }); 

    // Vertifikasjon til avsender
    await resend.emails.send({
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
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    //Error i mail, mailen kommer fortsatt frem til resend.com
    console.error('contact-api error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
