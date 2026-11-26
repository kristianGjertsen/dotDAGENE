# Dodle – 29. november

Spilleren skriver inn navn, får et tilfeldig ord fra `words.ts` og har seks forsøk. Fasitord trekkes fra juleordlisten. Gjetninger godtas når UiBs Ordbank finner et norsk bokmålsord (inkludert bøyninger) på fem bokstaver. Serveren bruker `https://ordbank.uib.no/api/lemmas` med `language=nob` og `search_inflection=true`. Ugyldige ord, tidsavbrudd og ordbokfeil bruker ingen forsøk. Gjentatte bokstaver vurderes som i Wordle: grønne treff reserveres før gule treff.

`Challenge.tsx` er skjermbildet. `logic.ts` inneholder bokstavvurdering. Serveren i `server/dodle.ts` velger og sjekker ordet; fasiten sendes ikke i klartekst før et tapt spill. Spillet beholdes i fanens sessionStorage når popupen lukkes. Spilltoken utløper etter 24 timer og etter lokalserver-omstart.

## Vercel Blob

`api/dodle.ts` lagrer kun løste spill når spilleren trykker «Send inn at jeg klarte det». Filen inneholder navn, `completed: true`, challenge-ID, spill-ID og tidspunkt. Gjetninger, tapte spill og antall forsøk lagres ikke i Blob. Samme spill-ID bruker samme filsti, slik at gjentatt innsending ikke lager flere bidrag.

1. Koble Blob-lageret til Vercel-prosjektet som deployer `frontend`, slik at `BLOB_READ_WRITE_TOKEN` er tilgjengelig for serverfunksjonene.
2. Public-lager (som i oppsettseksempelet) er standard. Filinnholdet krypteres med AES-256-GCM. Hvis lageret er Private, sett `DODLE_BLOB_ACCESS=private`.
3. Valgfritt: sett en stabil `DODLE_SECRET` (minst 32 tilfeldige tegn) som servermiljøvariabel. Ellers brukes Blob-tokenet som krypteringsnøkkel. Behold gammel nøkkel ved rotasjon hvis eldre resultater fortsatt skal kunne leses. Ikke bruk `VITE_` på disse variablene.
4. Fyll ut første luke i `content/advent.json` og sett `status: "published"` når konkurransen skal åpnes. Deploy endringene. En lukket eller avsluttet luke avviser produksjons-API-et.

Resultatfiler ligger under `results/dodle/`. For Public: last ned JSON-filen fra Vercel og dekrypter lokalt med samme nøkkel:

```sh
node scripts/read-dodle-result.mjs /sti/til/resultat.json
```

Skriptet leser miljøvariabler / `.env`. Ikke legg nøkler eller nedlastede resultatfiler i Git. Ingen resultat-URL eller nøkkel sendes tilbake til spilleren.

`npm run dev` bruker den ekte spillmotoren, men ingen Blob-skriving. Vinnermeldingen sier tydelig at lokal forhåndsvisning ikke lagrer resultater. Det gjør at testing ikke legger falske deltakere i konkurransen.

Dette er en enkel konkurranse uten innlogging: navn er selvoppgitt, og det er ingen grense på nye spill per person. Krypterte spilltoken beskytter mot endret fasit/resultat, men en teknisk bruker kan prøve flere grener fra et tidligere token. Dersom dere trenger streng én-deltakelse-per-person eller sikring mot automatisering, kreves autentisering og serverlagret spilltilstand.
