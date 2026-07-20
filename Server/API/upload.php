<?php
/**
 * Image Upload API
 * 
 * Endpoints:
 * POST /server/api/upload.php - Bild hochladen
 */

header('Content-Type: application/json');

// Erlaubte Unterordner (Whitelist)
$allowedFolders = ['', 'team', 'bg', 'content'];
$folder = isset($_POST['folder']) ? trim($_POST['folder'], '/') : '';
if (!in_array($folder, $allowedFolders, true)) {
    $folder = '';
}

$uploadDir = __DIR__ . '/../upload' . ($folder ? '/' . $folder : '');
$previewDir = __DIR__ . '/../upload/previews' . ($folder ? '/' . $folder : '');

// Upload- und Preview-Verzeichnisse erstellen falls nicht vorhanden
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}
if (!file_exists($previewDir)) {
    mkdir($previewDir, 0755, true);
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
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $filename = uniqid('img_', true) . '.' . $extension;
    $filepath = $uploadDir . '/' . $filename;
    $previewPath = $previewDir . '/' . $filename; // Gleicher Name, anderer Ordner
    
    // Temporäre Datei verschieben
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Fehler beim Speichern des Bildes']);
        exit;
    }
    
    // Bild verkleinern (max 1920px)
    resizeImage($filepath, $filepath, 1920, 1920, 85);
    
    // Thumbnail erzeugen (max 400px)
    resizeImage($filepath, $previewPath, 400, 400, 80);
    
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'tubox.de';
    $baseUrl = $protocol . '://' . $host . '/mg_woodscare';
    $url = $baseUrl . '/server/upload' . ($folder ? '/' . $folder : '') . '/' . $filename;
    $thumbnailUrl = $baseUrl . '/server/upload/previews' . ($folder ? '/' . $folder : '') . '/' . $filename;
    
    echo json_encode([
        'success' => true,
        'message' => 'Bild erfolgreich hochgeladen',
        'url' => $url,
        'thumbnailUrl' => $thumbnailUrl,
        'filename' => $filename,
        'size' => filesize($filepath),
        'type' => $file['type']
    ]);
    exit;
}

/**
 * Bild proportional verkleinern
 * 
 * @param string $src Pfad zum Quellbild
 * @param string $dst Pfad zum Zielbild
 * @param int $maxWidth Maximale Breite
 * @param int $maxHeight Maximale Höhe
 * @param int $quality JPEG-Qualität (0-100)
 */
function resizeImage($src, $dst, $maxWidth, $maxHeight, $quality) {
    list($origWidth, $origHeight, $type) = getimagesize($src);
    if (!$origWidth || !$origHeight) {
        return false;
    }
    
    // Verhältnis berechnen
    $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight, 1);
    $newWidth = (int) round($origWidth * $ratio);
    $newHeight = (int) round($origHeight * $ratio);
    
    // Bildressource laden
    switch ($type) {
        case IMAGETYPE_JPEG:
            $source = imagecreatefromjpeg($src);
            break;
        case IMAGETYPE_PNG:
            $source = imagecreatefrompng($src);
            break;
        case IMAGETYPE_WEBP:
            $source = imagecreatefromwebp($src);
            break;
        case IMAGETYPE_GIF:
            $source = imagecreatefromgif($src);
            break;
        default:
            return false;
    }
    
    if (!$source) {
        return false;
    }
    
    $resized = imagecreatetruecolor($newWidth, $newHeight);
    
    // Transparenz für PNG/WebP/GIF erhalten
    if (in_array($type, [IMAGETYPE_PNG, IMAGETYPE_WEBP, IMAGETYPE_GIF], true)) {
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
        imagefill($resized, 0, 0, $transparent);
    }
    
    imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
    
    // Bild speichern
    switch ($type) {
        case IMAGETYPE_JPEG:
            imagejpeg($resized, $dst, $quality);
            break;
        case IMAGETYPE_PNG:
            imagepng($resized, $dst, 8);
            break;
        case IMAGETYPE_WEBP:
            imagewebp($resized, $dst, $quality);
            break;
        case IMAGETYPE_GIF:
            imagegif($resized, $dst);
            break;
    }
    
    imagedestroy($source);
    imagedestroy($resized);
    
    return true;
}

// Ungültige Methode
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
