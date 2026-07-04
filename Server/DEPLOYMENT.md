# Backend Deployment Guide

## Lokale Entwicklung

Für die lokale Entwicklung ist die `.env` Datei bereits konfiguriert:

```env
VITE_API_BASE_URL=/Server/API
```

Der `Server/` Ordner wird lokal für die API verwendet.

## Externe Server Deployment

### 1. Server-Ordner hochladen

Lade den gesamten `Server/` Ordner auf deinen externen Server hoch:

```
deine-domain.de/
└── Server/
    ├── API/
    │   ├── content.php
    │   ├── upload.php
    │   └── .htaccess
    ├── Data/
    ├── Upload/
    └── .htaccess
```

### 2. PHP konfigurieren

Stelle sicher, dass dein Server PHP unterstützt und folgende Einstellungen hat:

- PHP 7.4 oder höher
- `upload_max_filesize = 5M`
- `post_max_size = 5M`
- `max_execution_time = 30`
- `memory_limit = 128M`

### 3. File Permissions

Setze die richtigen Berechtigungen:

```bash
chmod 755 Server/
chmod 755 Server/API/
chmod 755 Server/Data/
chmod 755 Server/Upload/
chmod 644 Server/API/*.php
chmod 644 Server/.htaccess
```

### 4. .env Datei anpassen

Passe die `.env` Datei im Projekt für den externen Server an:

```env
# Externer Server
VITE_API_BASE_URL=https://deine-domain.de/Server/API
```

### 5. Frontend neu bauen

Nachdem du die `.env` Datei angepasst hast, baue das Frontend neu:

```bash
npm run build
```

### 6. Frontend deployen

Lade das gebaute Frontend auf deinen externen Server hoch.

## API Endpoints

### Content API
- **GET** `https://deine-domain.de/Server/API/content.php` - Content laden
- **POST** `https://deine-domain.de/Server/API/content.php` - Content speichern
- **PUT** `https://deine-domain.de/Server/API/content.php` - Content aktualisieren

### Upload API
- **POST** `https://deine-domain.de/Server/API/upload.php` - Bild hochladen

## Sicherheit

Für Produktionsumgebungen solltest du:

1. **HTTPS verwenden** - SSL/TLS Zertifikat installieren
2. **CORS einschränken** - In den `.htaccess` Dateien die `Access-Control-Allow-Origin` auf deine Domain beschränken
3. **API Authentifizierung** - API Key oder Token-basierte Authentifizierung implementieren
4. **File Upload Validation** - Erweiterte Validierung für Uploads
5. **Rate Limiting** - Schutz gegen API Missbrauch

## Backup

Das Backend erstellt automatisch Backups der Content-Dateien:

```
Server/Data/
├── content.json
├── content_backup_2026-07-04_11-30-00.json
├── content_backup_2026-07-04_12-15-30.json
└── ...
```

Regelmäßige Backups des `Server/Data/` Ordners werden empfohlen.

## Troubleshooting

### API nicht erreichbar
- Prüfe ob PHP aktiviert ist
- Prüfe die `.htaccess` Konfiguration
- Prüfe die File Permissions

### CORS Fehler
- Prüfe die CORS Header in den `.htaccess` Dateien
- Prüfe ob die API URL korrekt in der `.env` Datei steht

### Upload funktioniert nicht
- Prüfe die PHP Upload Limits
- Prüfe die File Permissions im `Server/Upload/` Ordner
- Prüfe die Dateigröße (max 5MB)
