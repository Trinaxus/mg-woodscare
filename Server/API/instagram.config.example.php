<?php
/**
 * Beispiel-Konfiguration für Instagram API Proxy.
 *
 * Kopiere diese Datei zu instagram.config.php auf dem Server.
 *
 * access_token_encrypted: Der mit AES-256 verschlüsselte Instagram Access Token.
 * token_key:             Der Schlüssel, mit dem der Token verschlüsselt wurde.
 *
 * Verschlüsseln mit: npm run encrypt:instagram
 */

return [
    'access_token_encrypted' => 'GEHEIM_ENC_TOKEN_HIER',
    'token_key' => 'DEIN_GEHEIMER_SCHLUESSEL_HIER',
];
