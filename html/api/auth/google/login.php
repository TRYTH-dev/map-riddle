
<?php

declare(strict_types=1);

session_start();

$config = require dirname(__DIR__, 3) . '/config/google.php';

// CSRF対策用のstateを生成
$state = bin2hex(random_bytes(32));

$_SESSION['google_oauth_state'] = $state;

// Google認証URLを作成
$params = [
    'client_id' => $config['client_id'],
    'redirect_uri' => $config['redirect_uri'],
    'response_type' => 'code',
    'scope' => implode(' ', $config['scopes']),
    'state' => $state,
];

$authorizationUrl =
    $config['authorization_endpoint'] . '?' .
    http_build_query($params);

// Googleログイン画面へ移動
header('Location: ' . $authorizationUrl);
exit;
