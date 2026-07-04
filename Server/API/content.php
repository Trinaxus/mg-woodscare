<?php
/**
 * Content API - GET, POST, PUT für SiteContent
 * 
 * Endpoints:
 * GET  /server/api/content.php  - Lädt aktuellen Content
 * POST /server/api/content.php  - Speichert neuen Content
 * PUT  /server/api/content.php  - Aktualisiert Content
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// OPTIONS für CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataDir = __DIR__ . '/../data';
$contentFile = $dataDir . '/content.json';

// Data-Verzeichnis erstellen falls nicht vorhanden
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// GET - Content laden
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($contentFile)) {
        $content = file_get_contents($contentFile);
        echo $content;
    } else {
        // Fallback: defaultContent.json erstellen
        $defaultContent = [
            'status' => 'fallback',
            'message' => 'Kein Content gefunden, defaultContent.json erstellt'
        ];
        echo json_encode($defaultContent);
    }
    exit;
}

// POST/PUT - Content speichern
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }
    
    // Backup erstellen
    if (file_exists($contentFile)) {
        $backupFile = $dataDir . '/content_backup_' . date('Y-m-d_H-i-s') . '.json';
        copy($contentFile, $backupFile);
    }
    
    // Content speichern
    if (file_put_contents($contentFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
        echo json_encode([
            'success' => true,
            'message' => 'Content erfolgreich gespeichert',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Speichern des Content']);
    }
    exit;
}

// Ungültige Methode
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
