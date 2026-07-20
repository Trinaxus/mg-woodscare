<?php
/**
 * Google Reviews API
 * 
 * Endpoints:
 * GET  /server/api/google-reviews.php  - Ruft aktuelle Google-Bewertungen ab
 * POST /server/api/google-reviews.php  - Speichert Google-Konfiguration (API-Key, Place ID)
 */

header('Content-Type: application/json');

$dataDir = __DIR__ . '/../data';
$configDir = __DIR__ . '/../config';
$contentFile = $dataDir . '/content.json';
$configFile = $configDir . '/google.config.php';

function loadConfig() {
    global $configFile;
    if (file_exists($configFile)) {
        return include $configFile;
    }
    return ['api_key' => ''];
}

function saveConfig($apiKey) {
    global $configFile, $configDir;
    if (!file_exists($configDir)) {
        mkdir($configDir, 0755, true);
    }
    $content = "<?php\n/**\n * Google API Konfiguration\n */\n\nreturn [\n    'api_key' => " . var_export($apiKey, true) . ",\n];\n";
    file_put_contents($configFile, $content);
}

function loadContent() {
    global $contentFile;
    if (file_exists($contentFile)) {
        return json_decode(file_get_contents($contentFile), true);
    }
    return [];
}

function saveContent($content) {
    global $contentFile, $dataDir;
    if (!file_exists($dataDir)) {
        mkdir($dataDir, 0755, true);
    }
    if (file_exists($contentFile)) {
        $backupFile = $dataDir . '/content_backup_' . date('Y-m-d_H-i-s') . '.json';
        copy($contentFile, $backupFile);
    }
    file_put_contents($contentFile, json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function fetchGoogleReviews($apiKey, $placeId) {
    $url = "https://places.googleapis.com/v1/places/{$placeId}?fields=reviews&key={$apiKey}";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'X-Goog-Api-Client: glue/gee',
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('cURL-Fehler: ' . $error);
    }
    
    if ($httpCode !== 200) {
        $data = json_decode($response, true);
        $message = isset($data['error']['message']) ? $data['error']['message'] : 'HTTP-Fehler ' . $httpCode;
        throw new Exception($message);
    }
    
    return json_decode($response, true);
}

function mapGoogleReview($review) {
    $name = '';
    if (isset($review['authorAttribution']['displayName'])) {
        $name = $review['authorAttribution']['displayName'];
    }
    
    $text = '';
    if (isset($review['text']['text'])) {
        $text = $review['text']['text'];
    } elseif (isset($review['text'])) {
        $text = $review['text'];
    }
    
    $image = '';
    if (isset($review['authorAttribution']['photoUri'])) {
        $image = $review['authorAttribution']['photoUri'];
    }
    
    $date = '';
    if (isset($review['relativePublishTimeDescription'])) {
        $date = $review['relativePublishTimeDescription'];
    } elseif (isset($review['publishTime'])) {
        $date = date('d.m.Y', strtotime($review['publishTime']));
    }
    
    return [
        'name' => $name,
        'role' => 'Google-Bewertung',
        'text' => $text,
        'rating' => (int) ($review['rating'] ?? 5),
        'source' => 'google',
        'image' => $image,
        'date' => $date,
    ];
}

// GET - Bewertungen abrufen
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $config = loadConfig();
    $content = loadContent();
    $placeId = $content['settings']['googlePlaceId'] ?? '';
    
    if (empty($config['api_key'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Google API-Key nicht konfiguriert']);
        exit;
    }
    
    if (empty($placeId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Place ID nicht konfiguriert']);
        exit;
    }
    
    try {
        $data = fetchGoogleReviews($config['api_key'], $placeId);
        $reviews = [];
        
        if (isset($data['reviews']) && is_array($data['reviews'])) {
            $reviews = array_map('mapGoogleReview', $data['reviews']);
        }
        
        // Bewertungen in Content speichern
        if (!isset($content['reviews'])) {
            $content['reviews'] = [
                'title' => 'Das sagen unsere Kunden',
                'subtitle' => 'Echte Google-Bewertungen',
                'items' => [],
            ];
        }
        
        $content['reviews']['items'] = $reviews;
        $content['reviews']['subtitle'] = 'Echte Google-Bewertungen';
        if (!isset($content['settings'])) {
            $content['settings'] = [];
        }
        $content['settings']['reviewsLastSynced'] = date('Y-m-d H:i:s');
        
        saveContent($content);
        
        echo json_encode([
            'success' => true,
            'message' => count($reviews) . ' Bewertungen aktualisiert',
            'items' => $reviews,
            'lastSynced' => $content['settings']['reviewsLastSynced'],
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
    exit;
}

// POST - Konfiguration speichern
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }
    
    $apiKey = $data['apiKey'] ?? '';
    $placeId = $data['placeId'] ?? '';
    
    // API-Key in separate Config-Datei speichern (nicht in content.json!)
    if ($apiKey !== '') {
        saveConfig($apiKey);
    }
    
    // Place ID in content.json speichern
    $content = loadContent();
    if (!isset($content['settings'])) {
        $content['settings'] = [];
    }
    $content['settings']['googlePlaceId'] = $placeId;
    saveContent($content);
    
    echo json_encode([
        'success' => true,
        'message' => 'Google-Konfiguration gespeichert',
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
