<?php
/**
 * Image Upload API
 * 
 * Endpoints:
 * POST /server/api/upload.php - Bild hochladen
 */

header('Content-Type: application/json');

$uploadDir = __DIR__ . '/../upload';

// Upload-Verzeichnis erstellen falls nicht vorhanden
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// POST - Bild hochladen
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Kein Bild hochgeladen oder Upload-Fehler']);
        exit;
    }
    
    $file = $_FILES['image'];
    
    // Datei-Validierung
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Nur JPEG, PNG, WebP und GIF erlaubt']);
        exit;
    }
    
    $maxSize = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'Datei zu groß (max 5MB)']);
        exit;
    }
    
    // Dateiname generieren
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $extension;
    $filepath = $uploadDir . '/' . $filename;
    
    // Datei speichern
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        $url = '/server/upload/' . $filename;
        echo json_encode([
            'success' => true,
            'message' => 'Bild erfolgreich hochgeladen',
            'url' => $url,
            'filename' => $filename,
            'size' => $file['size'],
            'type' => $file['type']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Speichern des Bildes']);
    }
    exit;
}

// Ungültige Methode
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
