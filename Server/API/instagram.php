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
    $decoded = base64_decode($ciphertext, true);
    if ($decoded === false) return false;

    $parts = explode('::', $decoded, 2);
    if (count($parts) !== 2) return false;

    $iv = base64_decode($parts[0], true);
    $encrypted = base64_decode($parts[1], true);
    if ($iv === false || $encrypted === false) return false;

    $plain = openssl_decrypt($encrypted, 'AES-256-CBC', hash('sha256', $key, true), OPENSSL_RAW_DATA, $iv);
    return $plain !== false ? $plain : false;
}

function encryptToken(string $plain, string $key): string {
    $iv = random_bytes(16);
    $encrypted = openssl_encrypt($plain, 'AES-256-CBC', hash('sha256', $key, true), OPENSSL_RAW_DATA, $iv);
    return base64_encode(base64_encode($iv) . '::' . base64_encode($encrypted));
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
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        $refreshResponse = curl_exec($ch);
        $refreshHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $refreshData = json_decode($refreshResponse, true);
        if ($refreshHttpCode !== 200 || empty($refreshData['access_token'])) {
            http_response_code($refreshHttpCode ?: 500);
            echo $refreshResponse;
            exit;
        }

        $newToken = $refreshData['access_token'];
        $expiresIn = $refreshData['expires_in'] ?? 0;
        $newEncryptedToken = encryptToken($newToken, $tokenKey);

        $configContent = "<?php\nreturn [\n    'access_token_encrypted' => '" . addslashes($newEncryptedToken) . "',\n    'token_key' => '" . addslashes($tokenKey) . "',\n];\n";
        file_put_contents($configFile, $configContent, LOCK_EX);

        $logFile = __DIR__ . '/../data/instagram-token-log.json';
        $logEntry = [
            'last_refresh' => date('Y-m-d H:i:s'),
            'expires_at' => date('Y-m-d H:i:s', time() + $expiresIn),
            'expires_in_days' => round($expiresIn / 86400, 1),
        ];
        file_put_contents($logFile, json_encode($logEntry, JSON_PRETTY_PRINT), LOCK_EX);

        echo json_encode([
            'success' => true,
            'access_token' => $newToken,
            'expires_in' => $expiresIn,
            'expires_at' => $logEntry['expires_at'],
            'timestamp' => $logEntry['last_refresh'],
        ]);
        exit;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Ungültige Aktion. Erlaubt: account, feed, mentions, children, comments, refresh']);
        exit;
}
