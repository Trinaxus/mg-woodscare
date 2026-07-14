# TanStack Start Migration – SEO & SSG für MG Woodscare

## Ziel dieser Umstellung

Die Website soll für Suchmaschinen (SEO) besser erreichbar sein und schneller laden. Dazu wurde das Projekt von einer reinen **Vite Single-Page Application (SPA)** auf **TanStack Start** mit **Static Site Generation (SSG)** umgestellt.

## Was sich geändert hat

### Vorher: Vite SPA

- Nur eine einzige `index.html` wurde ausgeliefert.
- Alle Seiten wurden im Browser des Besuchers nachgeladen (Client-Side Routing).
- Google & Co. mussten JavaScript ausführen, um Inhalte zu sehen.
- Der Instagram Access Token lag im Browser-Code sichtbar.

### Nachher: TanStack Start mit SSG

- Jede Seite wird **zur Build-Zeit als echtes HTML** generiert.
- Beim ersten Aufruf bekommt der Besucher sofort lesbaren Inhalt.
- Suchmaschinen crawlen und indexieren die Seiten besser.
- Der Instagram Access Token wird **nur noch auf dem Server** verwendet.

## Neue Projektstruktur

```
mg-woodscare-main/
├── app.config.ts                 ← entfernt (wir verwenden Vite-Plugin)
├── vite.config.ts                ← TanStack Start Plugin + Prerendering
├── package.json                  ← Scripts: vite dev / vite build
├── src/
│   ├── routes/
│   │   ├── __root.tsx            ← Root-Route mit <html>, <head>, <body>
│   │   ├── index.tsx             ← Startseite
│   │   ├── leistungen.tsx
│   │   ├── referenzen.tsx
│   │   ├── kontakt.tsx
│   │   ├── impressum.tsx
│   │   ├── datenschutz.tsx
│   │   └── admin.tsx
│   ├── lib/
│   │   ├── instagram.ts          ← Client-Wrapper (ruft Server-Funktionen auf)
│   │   ├── instagram-server.ts ← Server-Funktionen (Token bleibt geheim)
│   │   └── content.ts
│   └── router.tsx                ← TanStack Router Konfiguration
```

> `index.html` und `main.tsx` wurden entfernt, weil TanStack Start diese selbst verwaltet.
> `src/server.ts` und `src/start.ts` (vinxi-spezifisch) wurden ebenfalls entfernt.

## Wichtige technische Änderungen

### 1. Vite Konfiguration (`vite.config.ts`)

```ts
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

tanstackStart({
  prerender: {
    enabled: true,                // SSG aktivieren
    autoStaticPathsDiscovery: true, // Statische Routen automatisch finden
    crawlLinks: true,               // Verlinkte Seiten mitgenerieren
    failOnError: true,              // Build failen, wenn Prerender fehlschlägt
  },
});
```

### 2. Root-Route (`src/routes/__root.tsx`)

Statt einer einfachen React-Komponente rendert die Root-Route jetzt das komplette HTML-Dokument:

```tsx
<html lang="de">
  <head>
    <HeadContent />   {/* Meta-Tags, Title, etc. */}
  </head>
  <body>
    <ContentProvider>
      <Outlet />      {/* Aktuelle Seite */}
    </ContentProvider>
    <Scripts />       {/* JavaScript-Bundle */}
  </body>
</html>
```

SEO-relevante Meta-Tags (Title, Description, OpenGraph, Twitter, Canonical) sind hier zentral definiert. Jede Route kann diese bei Bedarf überschreiben.

### 3. Instagram API auf dem Server (`src/lib/instagram-server.ts`)

Mit `createServerFn` aus TanStack Start werden serverseitige Funktionen definiert. Diese Funktionen laufen nur auf dem Server und können:

- Den Access Token aus der `.env` lesen (`VITE_INSTAGRAM_ACCESS_TOKEN`).
- Die Instagram Graph API aufrufen.
- Ergebnisse an den Browser zurückgeben.

Der Browser sieht den Token nie mehr.

### 4. Client-Wrapper (`src/lib/instagram.ts`)

Die alten Client-Funktionen bleiben als API erhalten, rufen aber intern die Server-Funktionen auf. Bestehender Code (z.B. `InstagramFeed.tsx`, `admin.tsx`) musste kaum geändert werden.

## Was bleibt gleich

- **Routes / Seiten**: Die Dateien in `src/routes/` sind fast unverändert.
- **Components**: Alle React-Komponenten funktionieren wie vorher.
- **Styling**: Tailwind CSS und die gesamte UI bleiben erhalten.
- **Content-Verwaltung**: Der Admin-Bereich und der JSON-basierte Content funktionieren weiterhin.

## Build-Ergebnis

Bei `npm run build` werden jetzt erzeugt:

- `dist/client/` – JavaScript, CSS, Assets für den Browser.
- `dist/server/` – Server-Rendering-Logik (für SSR/Hosting).
- Statische HTML-Dateien für alle Seiten:
  - `/index.html`
  - `/leistungen/index.html`
  - `/referenzen/index.html`
  - `/kontakt/index.html`
  - `/impressum/index.html`
  - `/datenschutz/index.html`
  - `/admin/index.html`

## Nächste Schritte / Hosting

Für das Hosting empfiehlt sich ein Anbieter, der Node.js oder statische Dateien unterstützt:

- **Vercel**: Unterstützt TanStack Start nativ (Node.js Runtime).
- **Netlify**: Funktionen oder statisches Deployment möglich.
- **Eigener Server**: `npm run build` + `npm run start` startet den Server.

Wenn nur statische HTML-Dateien ausreichen, können die Inhalte aus `dist/client/` (bzw. die gerenderten HTML-Dateien) auf jeden beliebigen Webserver hochgeladen werden.

## Wichtige Hinweise für den Kunden

1. **SEO**: Die Seiten sind jetzt für Google lesbar, ohne dass JavaScript ausgeführt werden muss.
2. **Performance**: Erste Inhalte erscheinen sofort, JavaScript lädt im Hintergrund nach.
3. **Sicherheit**: Der Instagram Token ist nicht mehr im Browser-Quellcode sichtbar.
4. **Kommentare/Erwähnungen**: Funktionieren nur, wenn der Instagram-Account und Token die nötigen Berechtigungen haben. Das ist unabhängig vom Framework.

## Befehle

```bash
# Entwicklungsserver starten
npm run dev

# Produktionsbuild inkl. SSG
npm run build

# Produktionsbuild mit Vorschau
npm run preview
```
