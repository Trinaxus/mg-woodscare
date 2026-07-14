# MG Woodscare Website

Öffentliche Website für **MG Woodscare** – Baumpflege & Sägewerk in Leipzig und Umgebung.

## Live-URL

- **Frontend:** https://mg-woodscare.vercel.app
- **Backend/API:** https://tubox.de/mg_woodscare/server/

## Technologie

- **Framework:** TanStack Start (React + Vite)
- **Rendering:** SSR + Static Prerendering (SEO-optimiert)
- **Styling:** Tailwind CSS
- **Sprache:** TypeScript
- **Icons:** Lucide React
- **Hosting:** Vercel (Frontend), All-Inkl (PHP-Backend)

## Features

- SEO-optimierte Seiten mit statischem HTML-Output
- Dynamisches Content-Management über Admin-Panel
- Bild-Uploads mit Vorschau für alle Content-Bereiche
- Mobile-first, responsive UI
- JSON-LD für Google (Organization / LocalBusiness)

## Wichtige Befehle

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktionsbuild (muss im Projektverzeichnis ausgeführt werden)
npm run build

# Build mit Vorschau
npm run preview
```

## Projektstruktur

```
src/
  routes/            # Seiten (file-based routing)
  components/        # Wiederverwendbare Komponenten
  data/              # Content-Schema & Defaults
  lib/               # API-Client, Content-Provider, Utilities
  assets/            # Statische Fallback-Bilder
public/              # Statische Dateien
server/              # PHP-Backend (außerhalb von src)
BAUANLEITUNGEN/      # Detaillierte JSON-Bauanleitung
```

## Dokumentation

- `BAUANLEITUNGEN/mg-woodscare-bauanleitung.json` – Vollständige maschinenlesbare Bauanleitung
- Für projektübergreifende Vorlagen und Timeline siehe `../PROJEKT-01/`

## Hinweise

- Der Build-Befehl muss im Projektverzeichnis ausgeführt werden.
- Über das Admin-Panel hochgeladene Bilder landen auf dem Server, nicht in Git.
- `src/assets/` enthält statische Fallback-Bilder.
