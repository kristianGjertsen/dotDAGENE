import crypto from 'crypto';

// --- Domenekonfig ---
const HOSTNAME = 'dotdagene.no';
const BASE_HTTP = `https://${HOSTNAME}`;

// --- Eventinformasjon ---
const EVENT_TITLE = 'dotDAGENE: Stands';
const EVENT_LOC = 'NTNU Realfagsbygget, U1';
const EVENT_DESC = 'Stands under dotDAGENE – velkommen!';

/**
 * 3. mars 2026 kl. 10:00–17:00 Europe/Oslo (CET = UTC+1)
 * UTC blir 09:00–16:00Z (ingen DST i starten av mars).
 */
const DTSTART_UTC = '20260303T090000Z';
const DTEND_UTC = '20260303T160000Z';

// --- Hjelpefunksjoner ---
function escapeICS(s: string) {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function nowUtcStamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function buildICS({
  uid,
  dtstampUtc,
  dtstartUtc,
  dtendUtc,
  summary,
  location,
  description,
  url,
}: {
  uid: string;
  dtstampUtc: string;
  dtstartUtc: string;
  dtendUtc: string;
  summary: string;
  location: string;
  description?: string;
  url?: string;
}) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dotDAGENE//Add-to-Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstampUtc}`,
    `DTSTART:${dtstartUtc}`,
    `DTEND:${dtendUtc}`,
    `SUMMARY:${escapeICS(summary)}`,
    `LOCATION:${escapeICS(location)}`,
    description ? `DESCRIPTION:${escapeICS(description)}` : '',
    url ? `URL:${url}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const uid = `${crypto.randomUUID()}@${HOSTNAME}`;
    const ics = buildICS({
      uid,
      dtstampUtc: nowUtcStamp(),
      dtstartUtc: DTSTART_UTC,
      dtendUtc: DTEND_UTC,
      summary: EVENT_TITLE,
      location: EVENT_LOC,
      description: EVENT_DESC,
      url: `${BASE_HTTP}/`,
    });

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="dotdagene-stands.ics"');
    return res.status(200).send(ics);
  } catch (err) {
    console.error('event-api error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

