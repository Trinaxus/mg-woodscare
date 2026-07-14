# Skill: Website nach PROJEKT-01-Vorlage bauen

> Dieser Skill beschreibt den wiederholbaren Workflow, um ein neues Projekt nach der gleichen Architektur wie MG Woodscare zu erstellen.

---

## Ziel

Ein neues Projekt (z. B. `PROJEKT-02`) mit folgender Architektur erstellen:

- **TanStack Start** (React + Vite)
- **SSR + Static Prerendering**
- **Tailwind CSS**
- **Content-Management** via Admin-Panel
- **Datenbanklos** oder mit optionaler Datenbank
- **SEO-optimiert** mit Meta-Tags und JSON-LD
- **Clean** ohne Lovable-/Demo-Reste

---

## Phase 1: Projekt-Interview

Bevor der Code geschrieben wird, müssen folgende Fragen geklärt werden:

### 1.1 Basisdaten

- **Projektname:**
- **Kunde:**
- **Branche:**
- **Regionale Ausrichtung?** (für LocalBusiness JSON-LD)
- **Soll eine eigene Domain genutzt werden?** Falls ja, welche?
- **Frontend-Hosting:** Vercel (Standard) oder anderes?
- **Backend-Hosting:** All-Inkl (Standard) oder anderes?

### 1.2 Architektur-Entscheidungen

#### Datenhaltung

- **Option A (Standard/empfohlen):** Datenbanklos. Content als JSON-Datei auf dem Server via PHP-API speichern.
  - Vorteile: Einfach, schnell, keine DB-Verwaltung.
  - Nachteile: Weniger skalierbar für sehr große Datenmengen.
- **Option B:** Mit Datenbank (z. B. MySQL, SQLite, PostgreSQL).
  - Wenn ja: Welche DB? Wer verwaltet sie?

→ **Standard für Handwerks-Websites:** Option A

#### Backend-Struktur

Wenn Option A gewählt:

```
server/
  API/
    get-content.php
    save-content.php
    upload.php
    login.php
  Upload/
    content/
  data/
    content.json
```

- **Sicherheit:** Login-Datei mit Passwort-Hash.
- **Datei-Rechte:** Upload-Ordner beschreibbar (`755` oder `775`).

#### Bilder

- **Upload über Admin-Panel?** Ja (Standard).
- **Fallback-Assets im Projekt?** Ja (Standard).
- **Server-URL für Bilder:** `https://[domain]/[projekt]/server/upload/`

### 1.3 Seitenstruktur

Standard-Seiten für fast alle Projekte:

- `/` Startseite
- `/[leistungen]` Leistungen / Angebote
- `/[referenzen]` Referenzen / Kunden
- `/[kontakt]` Kontakt
- `/impressum` Impressum (noindex)
- `/datenschutz` Datenschutz (noindex)
- `/admin` Admin-Panel

Zusätzliche Seiten nach Kundenbedarf:

- `/ueber-uns`
- `/blog`
- `/galerie`
- `/jobs`
- `/faq`

### 1.4 Besondere Features

- **Google-Bewertungen / Kundenbewertungen?** Ja/Nein
- **Instagram-Feed?** Ja/Nein (benötigt Access Token)
- **Kontaktformular?** Ja/Nein
- **Blog/News?** Ja/Nein
- **Mehrsprachigkeit?** Ja/Nein

---

## Phase 2: Projekt-Setup

### 2.1 Vorlage kopieren

```bash
cp -r /Volumes/INTERNAL-SSD/PROJECTE/2026/PROJEKT-01 /Volumes/INTERNAL-SSD/PROJECTE/2026/PROJEKT-02
cd /Volumes/INTERNAL-SSD/PROJECTE/2026/PROJEKT-02
```

ODER

```bash
cp -r /Volumes/INTERNAL-SSD/PROJECTE/2026/mg-woodscare-main /Volumes/INTERNAL-SSD/PROJECTE/2026/PROJEKT-02
```

### 2.2 Cleanup (Lovable-Reste und Demo-Daten entfernen)

Falls die Vorlage aus einem Lovable-Export oder ähnlichem stammt:

- [ ] `README.md` aus Lovable ersetzen durch eigene README
- [ ] Lovable-Branding entfernen (falls vorhanden)
- [ ] Favicon ersetzen (`public/favicon.ico`, `apple-touch-icon.png`, etc.)
- [ ] Demo-Komponenten und Demo-Seiten entfernen
- [ ] `package.json` bereinigen (nicht genutzte Dependencies entfernen)
- [ ] `.env`-Dateien prüfen und Secrets entfernen
- [ ] `dist/` und `node_modules/` löschen (werden neu generiert)
- [ ] `vercel.json` auf neue Domain/Backend anpassen

### 2.3 GitHub-Integration (besonders wichtig bei Lovable-Projekten)

- [ ] GitHub-Repository-URL notieren (z. B. `https://github.com/Trinaxus/projekt-02`)
- [ ] Lokalen Ordner mit GitHub-Remote verbinden:
  ```bash
  git init
  git remote add origin https://github.com/Trinaxus/projekt-02.git
  ```
- [ ] Branch auf `main` setzen:
  ```bash
  git branch -M main
  ```
- [ ] Ersten Commit und Push auf `main`:
  ```bash
  git add .
  git commit -m "Initialer Commit"
  git push -u origin main
  ```
- [ ] Vercel/Deployment mit dem GitHub-Repo verbinden

### 2.4 Projekt-Metadaten anpassen

- [ ] `package.json`: name, version, description, repository
- [ ] `README.md`: Projektbeschreibung, URLs, Befehle
- [ ] `vite.config.ts`: Prüfen, ob Projektname/Pfade passen
- [ ] `index.html` oder `src/routes/__root.tsx`: Titel, Sprache, Favicon
- [ ] `src/data/defaultContent.ts`: Kundenname, Adresse, Telefon, E-Mail, Social Media

### 2.5 Design-System anpassen

- [ ] Tailwind-Farben (Primary, Secondary, Accent) anpassen
- [ ] Logo und Favicon einfügen
- [ ] Fonts anpassen (falls abweichend)
- [ ] Custom-Klassen prüfen (`bg-gradient-forest`, `shadow-card`, etc.)

### 2.6 Backend einrichten

- [ ] Ordner `server/api/` auf Kunden-Server anlegen
- [ ] PHP-Endpunkte kopieren und anpassen
- [ ] Upload-Ordner `server/upload/content/` anlegen und beschreibbar machen (`755` oder `775`)
- [ ] Preview-Ordner `server/upload/previews/` anlegen und beschreibbar machen
- [ ] `upload.php` prüfen:
  - Max. Dateigröße 5 MB
  - Original wird auf max. 1920px skaliert
  - Thumbnail wird auf max. 400px skaliert
  - Thumbnail landet in `upload/previews/` mit **gleichem Dateinamen** wie Original
- [ ] `content.json` mit Defaults befüllen
- [ ] Admin-Passwort setzen (Hash!)
- [ ] Backend-URL in `src/lib/api.ts` eintragen

---

## Phase 3: Content & Seiten bauen

### 3.1 Content-Schema definieren

In `src/data/defaultContent.ts`:

- [ ] Welche Sektionen gibt es? (hero, stats, leistungen, ueberUns, features, referenzen, kontakt, social, footer, instagram, reviews)
- [ ] Welche Sektionen haben Bilder?
- [ ] Welche Sektionen sind Listen? (Team, Referenzen, Leistungen, Bewertungen)

### 3.2 Routen erstellen

Für jede öffentliche Seite:

- [ ] `src/routes/[seite].tsx` erstellen
- [ ] Meta-Tags in `head()` definieren
- [ ] H1 mit Content befüllen
- [ ] Bilder dynamisch aus Content laden (mit Fallback)

### 3.3 Admin-Panel einrichten

- [ ] Tab pro Content-Sektion
- [ ] Textfelder, Textareas, List-Editoren
- [ ] ImageField für alle Bildbereiche
- [ ] Login-Screen anpassen

---

## Phase 4: SEO & Sicherheit

- [ ] Meta-Tags für alle Routen prüfen
- [ ] JSON-LD in `SiteChrome.tsx` anpassen (Organization, ggf. LocalBusiness)
- [ ] `vercel.json` anpassen:
  - CSP `img-src` mit Backend-Domain
  - `connect-src` mit Backend- und Instagram-Domain
  - HSTS, X-Frame-Options, etc.
- [ ] Sitemap prüfen (`dist/client/sitemap.xml` nach Build)
- [ ] Robots-Regeln für `/admin` prüfen

---

## Phase 5: Build & Deployment

- [ ] `npm install` im Projektverzeichnis
- [ ] `npm run build` im Projektverzeichnis ausführen
- [ ] Prerendered HTML-Dateien prüfen
- [ ] Auf Vercel deployen
- [ ] Eigene Domain in Vercel hinterlegen (falls gewünscht)
- [ ] Backend auf Kunden-Server testen
- [ ] Admin-Login und Content-Speichern testen
- [ ] Bild-Upload testen

---

## Phase 6: Dokumentation aktualisieren

- [ ] `README.md` aktualisieren
- [ ] `HANDOUT.md` / zentrale Timeline erweitern
- [ ] `BAUANLEITUNGEN/mg-woodscare-bauanleitung.json` nicht anfassen (nur für MG Woodscare)
- [ ] Für neues Projekt: `BAUANLEITUNGEN/[projekt]-bauanleitung.json` aus `bauanleitung-vorlage.json` erstellen

---

## Standard-Interview-Prompt (für neue KI/Chats)

Wenn du diesen Skill an eine andere KI oder ein neues Chat-Fenster übergibst, nutze diesen Prompt:

```text
Du baust ein neues Website-Projekt nach dem PROJEKT-01-Standard.

Vor dem Coden führst du ein kurzes Interview mit dem Nutzer:
1. Projektname, Kunde, Branche, Domain
2. Datenbanklos (JSON via PHP-API) oder mit Datenbank?
3. Hosting: Vercel + All-Inkl (Standard) oder anders?
4. Welche Seiten sollen entstehen? (Standard: Start, Leistungen, Referenzen, Kontakt, Impressum, Datenschutz, Admin)
5. Zusätzliche Features? (Google-Bewertungen, Instagram, Kontaktformular, Blog, Mehrsprachigkeit)
6. Farben/Design-Vorgaben?

Danach setzt du das Projekt Schritt für Schritt um:
- Vorlage kopieren (aus PROJEKT-01 oder mg-woodscare-main)
- Cleanup durchführen (Lovable-Reste, Demo-Daten, Favicon)
- Projekt-Metadaten anpassen
- Backend-Struktur auf Server einrichten
- Content-Schema, Routen, Admin-Panel, SEO
- Build und Deployment auf Vercel

Wichtige Regeln:
- Build-Befehl immer im Projektverzeichnis ausführen.
- Bilder über Admin-Panel landen auf dem Server, nicht in Git.
- Neue Features: zuerst Content-Schema, dann Admin-Panel, dann Frontend.
- Jede öffentliche Route bekommt eigene Meta-Tags.
- Impressum und Datenschutz bekommen noindex.
```
