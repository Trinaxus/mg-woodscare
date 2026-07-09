<?php
/**
 * Instagram Token Status API
 *
 * Gibt Status-Informationen zum gespeicherten Instagram Access Token zurück,
 * ohne den Token selbst preiszugeben.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$configFile = __DIR__ . '/instagram.config.php';
$logFile = __DIR__ . '/../data/instagram-token-log.json';

$status = [
    'configured' => false,
    'has_log' => false,
    'last_refresh' => null,
    'expires_at' => null,
    'expires_in_days' => null,
    'expires_in_seconds' => null,
    'healthy' => false,
    'message' => 'Kein Token konfiguriert',
];

if (file_exists($configFile)) {
    $config = require $configFile;
    $status['configured'] = !empty($config['access_token_encrypted']) && !empty($config['token_key']);
    $status['message'] = $status['configured'] ? 'Token konfiguriert' : 'Token unvollständig';
}

if (file_exists($logFile)) {
    $log = json_decode(file_get_contents($logFile), true);
    if (is_array($log)) {
        $status['has_log'] = true;
        $status['last_refresh'] = $log['last_refresh'] ?? null;
        $status['expires_at'] = $log['expires_at'] ?? null;

        if (!empty($log['expires_at'])) {
            $expiresAt = strtotime($log['expires_at']);
            if ($expiresAt !== false) {
                $now = time();
                $diff = $expiresAt - $now;
                $status['expires_in_seconds'] = $diff;
                $status['expires_in_days'] = round($diff / 86400, 1);
                $status['healthy'] = $diff > 0 && $diff > 5 * 86400; // gesund wenn noch > 5 Tage
                $status['message'] = $diff > 0
                    ? 'Token gültig'
                    : 'Token abgelaufen';
            }
        }
    }
}

echo json_encode($status, JSON_PRETTY_PRINT);
