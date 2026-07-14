# MG Woodscare – Projektdokumentation / Anleitung

> Diese Anleitung gilt für das aktuelle Projekt (`mg-woodscare-main`) und soll als Vorlage für ähnliche Projekte dienen.

## 1. Projekttyp & Architektur

- **Frontend-Framework:** [TanStack Start](https://tanstack.com/start) auf React
- **Build-Tool:** Vite 8.x
- **Router:** File-based Routing über TanStack Router (`src/routes/...`)
- **Rendering:** Server-Side Rendering (SSR) + Static Prerendering aktiviert
  - `vite.config.ts` → `prerender: { enabled: true }`
  - Alle öffentlichen Routen werden zu statischem HTML vorgerendert
- **SEO-tauglich:** Ja. Meta-Tags pro Route, statischer HTML-Output, Sitemap, JSON-LD

## 2. Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Sprache | TypeScript |
| UI | React 18+ |
| Styling | Tailwind CSS |
| Komponenten | shadcn/ui (Basis), eigene Komponenten |
| Icons | Lucide React |
| State (Content) | React Context (`src/lib/content.tsx`) |
| Bilder | Statische Assets + dynamische Upload-URLs |
| SEO | TanStack Router `head()`, JSON-LD in `SiteChrome.tsx` |

## 3. Projektstruktur (relevante Dateien)

```
src/
  routes/            # Seiten (file-based routing)
    __root.tsx       # Root-Layout
    index.tsx        # Startseite
    leistungen.tsx
    referenzen.tsx
    kontakt.tsx
    admin.tsx        # Admin-Panel
    impressum.tsx
    datenschutz.tsx
  components/        # Wiederverwendbare Komponenten
  data/defaultContent.ts   # Content-Schema & Defaults
  lib/content.tsx    # Content-Provider (API + Merge)
  lib/api.ts         # API-Client inkl. uploadImage
public/              # Statische Dateien
server/              # PHP-Backend (liegt außerhalb von src/)
```

## 4. Content-System

- Alle Texte, Bilder, Social-Media-Links etc. werden aus `defaultContent.ts` geladen.
- Zur Laufzeit merged der `ContentProvider` die Defaults mit Daten vom Backend (`/api/get-content.php`).
- Admin-Panel (`/admin`) erlaubt das Bearbeiten aller Inhalte.

## 5. Bild-Uploads

- Admin-Panel bietet pro Content-Sektion ein Upload-Feld mit Vorschau.
- Upload erfolgt über `src/lib/api.ts` → `uploadImage()` an `https://tubox.de/mg_woodscare/server/api/upload.php`.
- Hochgeladene Bilder landen auf dem All-Inkl-Server im Ordner `server/upload/content/`.
- Das Backend skaliert automatisch:
  - **Original:** max. 1920px (Qualität 85%)
  - **Thumbnail:** max. 400px (Qualität 80%)
- Thumbnails werden im Ordner `server/upload/previews/` mit **gleichem Dateinamen** wie das Original gespeichert.
- Admin-Panel zeigt automatisch die Thumbnail-Vorschau an.
- Frontend nutzt dynamische URL mit Fallback auf lokale Assets.

## 6. Build & Deployment

### Lokal bauen

```bash
npm install
npm run build
```

Output:
- `dist/client/` – statische Assets
- `dist/server/` – SSR-Server & prerendered HTML

### Wichtig

`npm run build` muss **im Projektverzeichnis** ausgeführt werden:

```bash
cd /Volumes/INTERNAL-SSD/PROJECTE/2026/mg-woodscare-main
npm run build
```

### Deployment

- **Frontend:** Vercel (`https://mg-woodscare.vercel.app`)
- **Backend/API:** All-Inkl Hosting (`https://tubox.de/mg_woodscare/server/`)
- Vercel liefert HTTP/2 und HTTP/3 automatisch aus.

## 7. SEO-Relevante Konfiguration

- `vercel.json` enthält Security-Header (CSP, HSTS, etc.)
- CSP `img-src` erlaubt `https://tubox.de` für Server-Bilder.
- Jede Route setzt eigene Meta-Tags via `head()`.
- JSON-LD für `Organization` und `LocalBusiness` in `SiteChrome.tsx`.

## 8. Nächste geplante Features

- Google-Bewertungen / Kundenbewertungen auf der Startseite (admin-steuerbar)
- Siehe `HANDOUT.md` für aktuellen Stand & Timeline.
