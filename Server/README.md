# MG Woodscare Backend API

## Verzeichnisstruktur

```
Server/
├── API/              # PHP-Skripte für API-Endpunkte
│   ├── content.php   # Content CRUD (GET, POST, PUT)
│   ├── upload.php    # Bild-Upload
│   └── .htaccess     # API-Konfiguration
├── Data/             # JSON-Content-Dateien
│   └── content.json  # Haupt-Content-Datei
├── Upload/           # Hochgeladene Bilder
└── .htaccess         # Server-Konfiguration
```

## API-Endpunkte

### Content API
- **GET** `/Server/API/content.php` - Lädt aktuellen Content
- **POST** `/Server/API/content.php` - Speichert neuen Content
- **PUT** `/Server/API/content.php` - Aktualisiert Content

### Upload API
- **POST** `/Server/API/upload.php` - Bild hochladen

## Deployment

Auf externem Server:
1. Alle Dateien in `/Server/` Verzeichnis hochladen
2. PHP-Server konfigurieren (Apache/Nginx)
3. CORS und File-Permissions prüfen
4. API-URL in Frontend konfigurieren

## Sicherheit

- CORS für alle Origin (für Entwicklung)
- File-Upload Validierung (Typ, Größe)
- Backup-System für Content-Änderungen
- .htaccess für Directory-Schutz
