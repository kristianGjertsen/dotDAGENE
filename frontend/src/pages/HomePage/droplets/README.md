# DropletHero

Kopier hele denne mappen til for eksempel `src/components/droplets/` i React/TypeScript-prosjektet. Ingen Sass, Tailwind-konfigurasjon eller shader-plugin er nødvendig.

```sh
npm install three
npm install -D @types/three
```

React 18+ og React-typene må allerede finnes i vertsprosjektet.

```tsx
import { DropletHero } from './components/droplets';

export default function Home() {
  return (
    <main>
      <DropletHero scrollTarget="innhold" />
      <section id="innhold" className="px-6 py-24">
        Resten av siden
      </section>
    </main>
  );
}
```

Komponenten har seks dekorative blobs, intro, scrollbuer, museblob med myk start og siste posisjon, samt egen tekstfarge under bloben. Den bruker vanlig sidescroll.

## Innstillinger

| Prop | Standard | Betydning |
| --- | --- | --- |
| `title` | `dotDAGENE` | Tekst på én linje |
| `backgroundColor` | `#fffbf1` | Bakgrunn i toppseksjonen |
| `blobColor` | `#78b74c` | Din siste grunnfarge; endelig farge påvirkes av glass/blanding |
| `textColor` | `#1b7c20` | Vanlig tekstfarge |
| `hoverTextColor` | `#000000` | Tekst under blobene |
| `fontFamily` | `"Bricolage Grotesque", sans-serif` | Font, se nedenfor |
| `colorSpeed` | `0.4` | Fargebevegelse; 0 stopper denne |
| `introDuration` | `0.7` | Falltid i sekunder, pluss litt forsinkelse per blob |
| `scrollHeight` | `180` | Total høyde i svh; 180 gir 80svh scroll før seksjonen slipper |
| `scrollTarget` | utelatt | ID til neste seksjon; viser scroll-lenke når angitt |
| `className`, `style` | utelatt | Stil på komponentens ytre wrapper |

Standardene følger de siste verdiene i kildekoden før oppryddingen. Ved endring av props startes effekten på nytt.

```tsx
<DropletHero
  title="dotDAGENE"
  hoverTextColor="#59a668"
  colorSpeed={0.3}
  introDuration={1.2}
  scrollHeight={180}
  scrollTarget="innhold"
/>
```

## Font

Komponenten laster ikke inn eksterne fonter automatisk. For samme utseende som demoen må vertsprosjektet laste **Bricolage Grotesque**, eller du sender inn en font prosjektet allerede bruker. Eksempel i HTML-head:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@200..800&display=swap" rel="stylesheet" />
```

Uten fonten brukes sans-serif. Hvis du bruker en CSS-fontvariabel fra for eksempel Next.js, send den inn via `fontFamily="var(--font-bricolage)"`.

## Isolasjon og livssyklus

- Stiler og canvas ligger i Shadow DOM. Ingen globale `body`, `html`, `canvas`, ID-er eller CSS-reset. Tailwind-klasser på andre elementer påvirkes ikke.
- Ingen delte renderere eller globale musevariabler. Flere instanser fungerer uavhengig.
- Canvas er begrenset til toppseksjonen og fanger ikke klikk.
- React-unmount frigjør animasjonsrammer, lyttere, observatører, teksturer, materialer, geometri og begge WebGL-kontekstene.
- Import fungerer med SSR; selve effekten monteres kun i nettleseren. Uten WebGL beholdes tekst og vanlig scroll.
- Respekterer redusert bevegelse.
- La foreldreelementene tillate vanlig sidescroll. `overflow: hidden/auto`, transformasjoner eller fast høyde på en forelder kan påvirke sticky-plasseringen.
- Ytre layout kan fortsatt påvirkes av vertsprosjektet. Intern styling tilpasses med props, ikke Tailwind-selektorer.

## Filer

- `index.tsx`: React-komponent og offentlige props.
- `engine.ts`: rendering, musehåndtering, scroll og opprydding.
- `shaders.ts`: blobenes form, plassering, kurver og lys.
- `styles.ts`: kun interne stiler.

Behold [ATTRIBUTION.md](ATTRIBUTION.md) sammen med komponenten.
