# Én mappe per luke

Hver datomappe inneholder:

- `Popup.tsx`: Innholdet i denne lukens popup. Start med `DayPopupContent`, eller bygg ditt eget innhold.
- `Challenge.tsx`: Denne lukens interaktive oppgave. Erstatter eksempeloppgaven når dere har bestemt utfordringen.
- `index.ts`: Kobler popup og challenge sammen. Sett `challengeEnabled: true` når oppgaven er klar, eller `false` for en vanlig luke uten challenge.

`days/index.ts` kobler datoene til mappene. `AdventPopup.tsx` håndterer dialog, fokus, lukking og stegene intro → challenge → fullført. Dato, publisering, tittel, beskrivelse og deltakerlenke redigeres fortsatt i `frontend/content/advent.json`.

## Bygg en challenge

1. Åpne datomappens `Challenge.tsx` og bytt ut `ChallengeExample` med egen React-komponent.
2. Kall `onComplete()` først når oppgaven er løst, og `onBack()` for å gå tilbake til introduksjonen.
3. Bruk `id="package-title"` på overskriften og `id="package-description"` på introduksjonen. Dialogen bruker disse for skjermleser og fokus.
4. Tilpass `Popup.tsx` ved behov. `onStart` finnes bare når luken er publisert og challenge er aktivert. Koble startknappen til denne funksjonen.
5. Aktiver challenge i datomappens `index.ts`. Publiser selve luken i `content/advent.json` når den skal åpnes.

Første luke har en fungerende «Finn snøfnugget»-demo aktivert kun i utviklingsmodus. Alle andre har eksempelkomponenten klar, men deaktivert. Ingen eksempelchallenge er aktivert i produksjon.

Kommende luker viser bare åpningsdato; avsluttede luker kan leses, men kan ikke starte en challenge. Fullføring er foreløpig kun lokal UI-tilstand, nullstilles når popupen lukkes, og registrerer ikke konkurransedeltakelse eller premier. Legg senere eventuell varig innsending og svarvalidering i API-et.

Kode og importerte bilder i disse mappene er offentlige frontend-ressurser. Oppbevar ikke hemmelige fasiter eller upubliserte premiedetaljer her. Utkasttekst i `content/advent.json` filtreres av API-et.
