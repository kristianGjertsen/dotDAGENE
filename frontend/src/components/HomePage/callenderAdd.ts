// server.ts
// Express-server for dotDAGENE.no
// Viser tre knapper: Apple (.ics), Apple-abonnement (webcal), Google Calendar
// og sender .ics-filer med riktige headers slik at Kalender åpnes direkte på macOS/iOS.

import express from "express";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// --- Domenekonfig ---
const HOSTNAME = "dotdagene.no";
const BASE_HTTP = `https://${HOSTNAME}`;

// --- Eventinformasjon ---
const EVENT_TITLE = "dotDAGENE: Stands";
const EVENT_LOC = "NTNU Realfagsbygget, U1";
const EVENT_DESC = "Stands under dotDAGENE – velkommen!";

/**
 * 3. mars 2026 kl. 10:00–17:00 Europe/Oslo (CET = UTC+1)
 * UTC blir 09:00–16:00Z (ingen DST i starten av mars).
 */
const DTSTART_UTC = "20260303T090000Z";
const DTEND_UTC = "20260303T160000Z";

// --- Hjelpefunksjoner ---
function escapeICS(s: string) {
    return s
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\r?\n/g, "\\n");
}

function nowUtcStamp() {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
        d.getUTCFullYear().toString() +
        pad(d.getUTCMonth() + 1) +
        pad(d.getUTCDate()) +
        "T" +
        pad(d.getUTCHours()) +
        pad(d.getUTCMinutes()) +
        pad(d.getUTCSeconds()) +
        "Z"
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
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//dotDAGENE//Add-to-Calendar//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${dtstampUtc}`,
        `DTSTART:${dtstartUtc}`,
        `DTEND:${dtendUtc}`,
        `SUMMARY:${escapeICS(summary)}`,
        `LOCATION:${escapeICS(location)}`,
        description ? `DESCRIPTION:${escapeICS(description)}` : "",
        url ? `URL:${url}` : "",
        "END:VEVENT",
        "END:VCALENDAR",
    ].filter(Boolean);
    return lines.join("\r\n");
}

function makeGoogleCalendarUrl({
    title,
    details,
    location,
    dtstartUtc,
    dtendUtc,
}: {
    title: string;
    details?: string;
    location?: string;
    dtstartUtc: string;
    dtendUtc: string;
}) {
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        details: details ?? "",
        location: location ?? "",
        dates: `${dtstartUtc}/${dtendUtc}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// --- Ruter ---

// 1) Landingsside med knapper
app.get("/", (_req, res) => {
    const googleUrl = makeGoogleCalendarUrl({
        title: EVENT_TITLE,
        details: EVENT_DESC,
        location: EVENT_LOC,
        dtstartUtc: DTSTART_UTC,
        dtendUtc: DTEND_UTC,
    });

    const html = `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Legg til i kalender – dotDAGENE</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:2rem;line-height:1.4}
    .wrap{max-width:720px;margin:0 auto}
    h1{margin:0 0 0.5rem}
    .meta{color:#555;margin-bottom:1.5rem}
    .btns{display:flex;gap:0.75rem;flex-wrap:wrap}
    a.button{display:inline-block;padding:0.75rem 1rem;border-radius:12px;text-decoration:none;border:1px solid #ddd}
    a.button:hover{background:#f7f7f7}
    code{background:#f1f1f1;padding:0.1rem 0.3rem;border-radius:6px}
  </style>
</head>
<body>
  <div class="wrap">
    <h1>${EVENT_TITLE}</h1>
    <div class="meta">3. mars 2026, kl. 10:00–17:00 (Europe/Oslo) · ${EVENT_LOC}</div>

    <div class="btns">
      <a class="button" href="/event.ics">Legg til i Apple-Kalender (.ics)</a>
      <a class="button" href="webcal://${HOSTNAME}/feed.ics">Abonner i Apple-Kalender (webcal)</a>
      <a class="button" href="${googleUrl}" target="_blank" rel="noreferrer">Legg til i Google Kalender</a>
    </div>

    <p style="margin-top:1.5rem;color:#666">
      På macOS/iOS åpnes <code>.ics</code> direkte i Kalender.
      <br/>Lenken med <code>webcal://</code> oppretter et abonnement som kan oppdateres automatisk.
    </p>
  </div>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
});

// 2) Enkelt event (.ics)
app.get("/event.ics", (_req, res) => {
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

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'inline; filename="dotdagene-stands.ics"');
    res.send(ics);
});

// 3) Feed for abonnement (webcal://dotdagene.no/feed.ics)
app.get("/feed.ics", (_req, res) => {
    const uid = `feed-${crypto.randomUUID()}@${HOSTNAME}`;
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//dotDAGENE//Calendar-Feed//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:dotDAGENE",
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${nowUtcStamp()}`,
        `DTSTART:${DTSTART_UTC}`,
        `DTEND:${DTEND_UTC}`,
        `SUMMARY:${escapeICS(EVENT_TITLE)}`,
        `LOCATION:${escapeICS(EVENT_LOC)}`,
        `DESCRIPTION:${escapeICS(EVENT_DESC)}`,
        `URL:${BASE_HTTP}/`,
        "END:VEVENT",
        "END:VCALENDAR",
    ].join("\r\n");

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'inline; filename="dotdagene-feed.ics"');
    res.send(lines);
});

app.listen(PORT, () => {
    console.log(`Server kjører på ${BASE_HTTP} (port ${PORT})`);
});
