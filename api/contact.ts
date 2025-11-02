// api/contact.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  const { bedriftsnavn, kontaktperson, stilling, epost, melding } = req.body || {};

  if (!bedriftsnavn || !kontaktperson || !stilling || !epost) {
    return res.status(400).json({ error: 'Mangler påkrevde felt' });
  }

  const subject = `Henvendelse fra ${bedriftsnavn}`;
  const text = `
Bedriftsnavn: ${bedriftsnavn}
Kontaktperson: ${kontaktperson}
Stilling: ${stilling}
E-post: ${epost}

Melding:
${melding || '(tom)'}
  `.trim();

  try {
    await resend.emails.send({
      from: 'dotDAGENE <kontakt@dotdagene.no>',
      to: ['kontakt@dotdagene.no'],
      subject,
      text,
      replyTo: epost,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Kunne ikke sende e-post' });
  }
}
