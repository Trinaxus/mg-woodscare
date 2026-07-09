<?php
/**
 * Instagram Token Refresh Cron
 *
 * Dieses Script erneuert den verschlüsselten Instagram Access Token
 * und schreibt ihn zurück in instagram.config.php.
 *
 * Aufruf per Cron-Job (empfohlen):
 *   php /pfad/zum/server/api/refresh-token-cron.php
 *
 * Oder per HTTP mit Secret:
 *   https://tubox.de/mg_woodscare/server/api/refresh-token-cron.php?secret=DEIN_SECRET
 *
 * Empfohlene Cron-Häufigkeit: einmal pro Woche oder einmal pro Monat.
 */

header('Content-Type: application/json');

$configFile = __DIR__ . '/instagram.config.php';
$secret = $_ENV['INSTAGRAM_CRON_SECRET'] ?? '';

// Optionaler Schutz bei HTTP-Aufrufen
if (PHP_SAPI !== 'cli') {
    $providedSecret = $_GET['secret'] ?? '';
    if (empty($secret) || empty($providedSecret) || !hash_equals($secret, $providedSecret)) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden: cron secret fehlt oder ungültig']);
        exit;
    }
}

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

$accessToken = decryptToken($encryptedToken, $tokenKey);
if ($accessToken === false || empty($accessToken)) {
    http_response_code(500);
    echo json_encode(['error' => 'Instagram Access Token konnte nicht entschlüsselt werden']);
    exit;
}

$url = 'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . urlencode($accessToken);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Fehler: ' . $curlError]);
    exit;
}

$data = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE || empty($data['access_token'])) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Instagram hat keinen neuen Token zurückgegeben',
        'http_code' => $httpCode,
        'response' => $data,
    ]);
    exit;
}

$newToken = $data['access_token'];
$expiresIn = $data['expires_in'] ?? 0;
$newEncryptedToken = encryptToken($newToken, $tokenKey);

$configContent = "<?php\nreturn [\n    'access_token_encrypted' => '" . addslashes($newEncryptedToken) . "',\n    'token_key' => '" . addslashes($tokenKey) . "',\n];\n";

if (file_put_contents($configFile, $configContent, LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Konnte instagram.config.php nicht aktualisieren']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Instagram Access Token erfolgreich erneuert',
    'expires_in_days' => round($expiresIn / 86400, 1),
    'expires_at' => date('Y-m-d H:i:s', time() + $expiresIn),
    'timestamp' => date('Y-m-d H:i:s'),
]);
