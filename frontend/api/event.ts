import crypto from 'crypto';

// --- Domenekonfig ---
const HOSTNAME = 'dotdagene.no';
const BASE_HTTP = `https://${HOSTNAME}`;

// --- Eventinformasjon ---
const EVENT_TITLE = 'dotDAGENE: Stands';
const EVENT_LOC = 'NTNU Realfagbygget, U1';
const EVENT_DESC = 'Stands under dotDAGENE – velkommen!';

/**
 * 9. og 10. mars 2027 kl. 10:00-15:00 Europe/Oslo (CET = UTC+1)
 * UTC blir 09:00-14:00Z (ingen DST i starten av mars).
 */
const DTSTART_UTC_DAY_1 = '20270309T090000Z';
const DTEND_UTC_DAY_1 = '20270309T140000Z';
const DTSTART_UTC_DAY_2 = '20270310T090000Z';
const DTEND_UTC_DAY_2 = '20270310T140000Z';

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

function buildEvent({
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
  return [
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
  ].filter(Boolean);
}

function buildICS() {
  const dtstampUtc = nowUtcStamp();
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//dotDAGENE//Add-to-Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...buildEvent({
      uid: `${crypto.randomUUID()}@${HOSTNAME}`,
      dtstampUtc,
      dtstartUtc: DTSTART_UTC_DAY_1,
      dtendUtc: DTEND_UTC_DAY_1,
      summary: `${EVENT_TITLE} - 9. mars`,
      location: EVENT_LOC,
      description: EVENT_DESC,
      url: `${BASE_HTTP}/`,
    }),
    ...buildEvent({
      uid: `${crypto.randomUUID()}@${HOSTNAME}`,
      dtstampUtc,
      dtstartUtc: DTSTART_UTC_DAY_2,
      dtendUtc: DTEND_UTC_DAY_2,
      summary: `${EVENT_TITLE} - 10. mars`,
      location: EVENT_LOC,
      description: EVENT_DESC,
      url: `${BASE_HTTP}/`,
    }),
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

type EventRequest = {
  method?: string;
  url?: string;
};

type EventResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => EventResponse;
  json: (body: unknown) => EventResponse;
  send: (body: string) => EventResponse;
};

export default async function handler(req: EventRequest, res: EventResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Method not allowed',
        allowed: 'GET',
        received: req.method,
      });
    }

    const ics = buildICS();

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="dotdagene-stands.ics"');
    return res.status(200).send(ics);
  } catch (err) {
    console.error('event-api error:', err);
    return res.status(500).json({
      error: 'Internal error',
      message: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
