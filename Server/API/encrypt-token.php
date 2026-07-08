<?php
/**
 * Hilfsdatei zum Verschlüsseln des Instagram Access Tokens.
 *
 * Lade diese Datei auf den Server, rufe sie im Browser auf:
 *   https://tubox.de/mg_woodscare/server/api/encrypt-token.php
 *
 * Gib deinen Klartext-Token und einen beliebigen Schlüssel ein.
 * Kopiere die Ausgabe in instagram.config.php.
 *
 * WICHTIG: Diese Datei nach der Benutzung wieder vom Server löschen!
 */

function encryptToken(string $token, string $key): string {
    $iv = random_bytes(16);
    $cipherKey = hash('sha256', $key, true);
    $encrypted = openssl_encrypt($token, 'AES-256-CBC', $cipherKey, OPENSSL_RAW_DATA, $iv);
    return base64_encode(base64_encode($iv) . '::' . base64_encode($encrypted));
}

$encrypted = '';
$key = '';
$plain = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $plain = $_POST['token'] ?? '';
    $key = $_POST['key'] ?? '';

    if (empty($plain) || empty($key)) {
        $error = 'Bitte Token und Schlüssel eingeben.';
    } else {
        $encrypted = encryptToken($plain, $key);
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Instagram Token verschlüsseln</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
        label { display: block; margin-top: 20px; font-weight: 600; }
        input, textarea { width: 100%; padding: 10px; margin-top: 6px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #f8fafc; box-sizing: border-box; }
        button { margin-top: 20px; padding: 12px 24px; background: #22c55e; color: #0f172a; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
        button:hover { background: #4ade80; }
        .result { margin-top: 30px; padding: 20px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; }
        .result h2 { margin-top: 0; }
        code { display: block; padding: 12px; background: #0f172a; border-radius: 6px; white-space: pre-wrap; word-break: break-all; }
        .warning { color: #f87171; font-weight: 600; }
    </style>
</head>
<body>
    <h1>Instagram Access Token verschlüsseln</h1>

    <form method="POST">
        <label for="token">Instagram Access Token (Klartext)</label>
        <input type="text" id="token" name="token" value="<?php echo htmlspecialchars($plain); ?>" required>

        <label for="key">Schlüssel (zufällige Zeichenfolge, merk dir diese gut)</label>
        <input type="text" id="key" name="key" value="<?php echo htmlspecialchars($key); ?>" required>

        <button type="submit">Verschlüsseln</button>
    </form>

    <?php if ($error): ?>
        <p class="warning"><?php echo htmlspecialchars($error); ?></p>
    <?php endif; ?>

    <?php if ($encrypted): ?>
        <div class="result">
            <h2>Ergebnis für instagram.config.php</h2>
            <p>Kopiere das in deine <code>instagram.config.php</code>:</p>
            <code>&lt;?php
return [
    'access_token_encrypted' => '<?php echo htmlspecialchars($encrypted); ?>',
    'token_key' => '<?php echo htmlspecialchars($key); ?>',
];</code>
        </div>
    <?php endif; ?>

    <p class="warning" style="margin-top: 30px;">
        WICHTIG: Lösche diese Datei (encrypt-token.php) nach der Benutzung vom Server!
    </p>
</body>
</html>
