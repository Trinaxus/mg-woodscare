<?php
/**
 * Instagram API Proxy
 *
 * Endpunkt: /server/api/instagram.php?action=...
 *
 * Aktionen:
 * - account                -> GET  /me
 * - feed&limit=6           -> GET  /me/media
 * - mentions               -> GET  /me/mentioned_media
 * - children&mediaId=...   -> GET  /{mediaId}/children
 * - comments&mediaId=...   -> GET  /{mediaId}/comments
 * - refresh                -> GET  /refresh_access_token
 *
 * Der Access Token wird verschlüsselt in instagram.config.php gespeichert.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function decryptToken(string $ciphertext, string $key): string|false {
    $parts = explode('::', base64_decode($ciphertext), 2);
    if (count($parts) !== 2) return false;

    [$iv, $encrypted] = $parts;
    $plain = openssl_decrypt($encrypted, 'AES-256-CBC', hash('sha256', $key, true), OPENSSL_RAW_DATA, $iv);
    return $plain !== false ? $plain : false;
}

$configFile = __DIR__ . '/instagram.config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Instagram config fehlt: server/api/instagram.config.php']);
    exit;
}

$config = require $configFile;
$encryptedToken = $config['access_token_encrypted'] ?? '';
$tokenKey = $config['token_key'] ?? '';

if (empty($encryptedToken) || empty($tokenKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'Instagram Access Token oder Schlüssel nicht konfiguriert']);
    exit;
}

$accessToken = decryptToken($encryptedToken, $tokenKey);

if ($accessToken === false || empty($accessToken)) {
    http_response_code(500);
    echo json_encode(['error' => 'Instagram Access Token konnte nicht entschlüsselt werden']);
    exit;
}

$action = $_GET['action'] ?? '';
$baseUrl = 'https://graph.instagram.com';

function callInstagram(string $url): void {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError) {
        http_response_code(500);
        echo json_encode(['error' => 'cURL Fehler: ' . $curlError]);
        exit;
    }

    http_response_code($httpCode);
    echo $response;
    exit;
}

switch ($action) {
    case 'account':
        $fields = 'id,username,account_type,media_count,followers_count,follows_count,biography,profile_picture_url,name';
        $url = "$baseUrl/me?fields=$fields&access_token=$accessToken";
        callInstagram($url);
        break;

    case 'feed':
        $limit = intval($_GET['limit'] ?? 6);
        $fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username';
        $url = "$baseUrl/me/media?fields=$fields&limit=$limit&access_token=$accessToken";
        callInstagram($url);
        break;

    case 'mentions':
        $fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,username';
        $url = "$baseUrl/me/mentioned_media?fields=$fields&access_token=$accessToken";
        callInstagram($url);
        break;

    case 'children':
        $mediaId = $_GET['mediaId'] ?? '';
        if (empty($mediaId) || !ctype_digit($mediaId)) {
            http_response_code(400);
            echo json_encode(['error' => 'mediaId fehlt oder ungültig']);
            exit;
        }
        $fields = 'id,media_type,media_url,thumbnail_url';
        $url = "$baseUrl/$mediaId/children?fields=$fields&access_token=$accessToken";
        callInstagram($url);
        break;

    case 'comments':
        $mediaId = $_GET['mediaId'] ?? '';
        if (empty($mediaId) || !ctype_digit($mediaId)) {
            http_response_code(400);
            echo json_encode(['error' => 'mediaId fehlt oder ungültig']);
            exit;
        }
        $fields = 'id,text,timestamp,username';
        $url = "$baseUrl/$mediaId/comments?fields=$fields&access_token=$accessToken";
        callInstagram($url);
        break;

    case 'refresh':
        $url = "$baseUrl/refresh_access_token?grant_type=ig_refresh_token&access_token=$accessToken";
        callInstagram($url);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Aktion. Erlaubt: account, feed, mentions, children, comments, refresh']);
        exit;
}
