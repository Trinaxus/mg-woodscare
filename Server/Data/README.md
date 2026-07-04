# MG Woodscare - Backend Daten

## Inhalt

Dieser Ordner enthält die JSON-Datensätze für das Backend-API.

## Dateien

### content.json
Haupt-Content-Datei für die Website. Enthält alle Texte, Links und Konfigurationen.

## Struktur

Die JSON-Datei folgt der SiteContent-Struktur aus dem Frontend:

- **brand**: Markeninformationen (Name, Slogan, Standort)
- **hero**: Hero-Section (Titel, Untertitel, CTAs)
- **stats**: Statistiken (Erfahrung, Anzahl Bäume, etc.)
- **leistungen**: Leistungen-Sektion mit Icons und Beschreibungen
- **ueberUns**: Über uns Sektion mit Team-Informationen
- **features**: Sägewerk und Brennholz Features
- **referenzen**: Referenzen mit Kunden-Feedback
- **kontakt**: Kontaktinformationen (Telefon, E-Mail, Adresse)
- **instagram**: Instagram-Link und Handle
- **impressum**: Impressum-Texte
- **datenschutz**: Datenschutz-Texte

## API-Integration

Die PHP-Skripte im `../API/` Ordner lesen diese Datei:

- `content.php`: Liest und speichert content.json
- `upload.php`: Verarbeitet Bild-Uploads

## Deployment

1. Diese Datei auf den externen Server hochladen
2. Pfad: `https://tubox.de/mg_woodscare/server/Data/content.json`
3. PHP-Skripte müssen Schreibrechte auf diesen Ordner haben

## Backup

Änderungen werden automatisch mit Timestamp gesichert:
- `content_backup_YYYYMMDD_HHMMSS.json`

## Wichtig

- JSON-Format muss valide sein
- Keine trailing commas
- UTF-8 Encoding
- Berechtigungen: 644 (Datei), 755 (Ordner)
