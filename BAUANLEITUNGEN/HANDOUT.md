# MG Woodscare – Handout / Timeline

> Zusammenfassung aller Änderungen, Entscheidungen und offenen Punkte. Dient als Kontext-Übergabe für neue Chats/KIs.

## Projekt-Status

- **Projekt:** MG Woodscare Website
- **Branch:** main
- **Frontend-Hosting:** Vercel (`https://mg-woodscare.vercel.app`)
- **Backend-Hosting:** All-Inkl (`https://tubox.de/mg_woodscare/server/`)
- **Letzter Push:** Referenzen-Karten mit dezentem Stern-Badge

---

## Timeline

### 1. Dynamische Bildverwaltung implementiert

- **Ziel:** Bilder für Hero, Leistungen, Über uns, Features, Referenzen, Kontakt dynamisch über Admin-Panel verwalten.
- **Änderungen:**
  - `src/data/defaultContent.ts`: `image`-Felder ergänzt für `hero`, `ueberUns`, `features.sawmill`, `features.firewood`, `leistungen`, `referenzen`, `kontakt`.
  - `src/routes/admin.tsx`: Generische `ImageField`-Komponente mit Upload + Vorschau in allen relevanten Tabs.
  - `src/routes/index.tsx`, `leistungen.tsx`, `kontakt.tsx`, `referenzen.tsx`: Dynamische Bild-URLs mit Fallback auf statische Assets.
  - `vercel.json`: CSP `img-src` um `https://tubox.de` erweitert.
- **Status:** Abgeschlossen & gepusht.

### 2. Build-Prozess stabilisiert

- **Problem:** `npm run build` wurde außerhalb des Projektverzeichnisses ausgeführt → `ENOENT package.json`.
- **Lösung:** Build-Befehl muss im Ordner `/Volumes/INTERNAL-SSD/PROJECTE/2026/mg-woodscare-main` ausgeführt werden.
- **Status:** Erledigt.

### 3. Assets neu gepusht

- **Grund:** Viele Bilder in `src/assets/` wurden vom Nutzer überschrieben/verändert.
- **Geändert/Neu:** `001.png`, `002.png`, `003.jpg`, `005.jpg`, `006.jpg`, `007.jpg`, `008.jpg`, `arborist.jpg`, `firewood.jpg`, `hero-forest.jpg`, `logo_004.png`, `logo_005.png`, `sawmill.jpg`.
- **Status:** Gepusht.

### 4. Leistungen-Header vereinheitlicht

- **Änderung:** Leistungen-Header verwendet jetzt denselben Fallback (`heroForest`) wie Referenzen und Kontakt.
- **Datei:** `src/routes/leistungen.tsx`
- **Status:** Gepusht.

### 5. Referenzen-Karten Redesign

- **Ziel:** Sterne entfernen, professioneller Premium-Look.
- **Iterationen:**
  - Erste Banderole mit „Top“-Text → abgelehnt.
  - Banderole mit Haken-Kreis → zu wuchtig, Ecke abgeschnitten.
  - Schmale Banderole mit Haken → immer noch nicht sauber.
  - Eck-Dreieck-Banderole → falsche Orientierung.
  - **Final:** Dezenter runder Stern-Badge in der oberen rechten Ecke der Karte.
- **Status:** Implementiert, Build erfolgreich, **noch nicht gepusht** (warten auf finale Freigabe).

### 6. SEO & Meta-Tag Optimierungen

- **Änderungen:**
  - Globale Meta-Tags aus `head()` entfernt und statisch in `__root.tsx` eingefügt.
  - Description/Keywords nur setzen, wenn Werte vorhanden sind.
  - H1-relevante Defaults in `defaultContent.ts` gesetzt für besseren Prerender.
- **Status:** Abgeschlossen & gepusht.

### 7. HTTP/2 Performance-Check

- **Frage:** SEO-Tool zeigte „HTTP/2 unbekannt“ für `mg-woodscare.vercel.app`.
- **Ergebnis:** Vercel liefert HTTP/2 korrekt aus (`curl -I --http2` → `HTTP/2 200`).
- **Folge:** Fehler liegt wahrscheinlich am SEO-Tool selbst (fehlende ALPN-Protokoll-Auswahl in der Prüfung).
- **Status:** Geklärt, Prompt für SEO-Tool-Fix erstellt.

---

## Offene Punkte / Nächste Schritte

1. **Referenzen-Karten final pushen**
   - Letzte Änderung: dezenter Stern-Badge.
   - Noch nicht auf `main` gepusht.

2. **Google-Bewertungen / Kundenbewertungen**
   - Manuelle Verwaltung über Admin-Section.
   - Neue Sektion auf der Startseite.
   - Datenstruktur:
     ```ts
     reviews: {
       title: string;
       subtitle: string;
       items: {
         name: string;
         role: string;
         text: string;
         rating: number;
         source: "google" | "manual";
         image?: string;
         date?: string;
       }[];
     }
     ```
   - **Status:** Gemerkt für später.

3. **SEO-Tool verbessern**
   - HTTP/2/HTTP/3-Erkennung korrigieren.
   - Prompt dafür wurde bereits erstellt.

---

## Wichtige Konventionen

- Build immer im Projektverzeichnis ausführen.
- Bilder, die über das Admin-Panel hochgeladen werden, landen auf dem Server und nicht in Git.
- Assets in `src/assets/` sind statische Fallback-Bilder.
- Neue Features zuerst im Content-Schema (`defaultContent.ts`) erweitern, dann Admin-Panel, dann Frontend.
- Jede öffentliche Route sollte eigene Meta-Tags in `head()` definieren.

---

## Letzte bekannte Probleme

- `run_command` Tool akzeptiert `Cwd`-Parameter in dieser Umgebung nicht zuverlässig. Build-Befehle müssen manuell im Terminal im Projektordner ausgeführt werden.
