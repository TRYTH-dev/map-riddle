
<?php
declare(strict_types=1);

session_start();

$config = require dirname(__DIR__, 3) . '/config/google.php';
require_once dirname(__DIR__, 3) . '/config/db.php';

// Google認証エラー
if (isset($_GET['error'])) {
    http_response_code(400);
    exit('Google authentication was cancelled or failed.');
}

// 認証コードとstateを確認
$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';

if (
    !is_string($code) ||
    $code === '' ||
    !is_string($state) ||
    !isset($_SESSION['google_oauth_state']) ||
    !hash_equals($_SESSION['google_oauth_state'], $state)
) {
    http_response_code(400);
    exit('Invalid OAuth state or authorization code.');
}

unset($_SESSION['google_oauth_state']);

// アクセストークンを取得
$ch = curl_init($config['token_endpoint']);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'code' => $code,
        'client_id' => $config['client_id'],
        'client_secret' => $config['client_secret'],
        'redirect_uri' => $config['redirect_uri'],
        'grant_type' => 'authorization_code',
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $statusCode !== 200) {
    http_response_code(502);
    exit('Failed to obtain Google access token.');
}

$tokenData = json_decode($response, true);

if (!is_array($tokenData) || empty($tokenData['access_token'])) {
    http_response_code(502);
    exit('Invalid token response.');
}

// Googleユーザー情報を取得
$ch = curl_init($config['userinfo_endpoint']);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $tokenData['access_token'],
    ],
    CURLOPT_TIMEOUT => 15,
]);

$userResponse = curl_exec($ch);
$userStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($userResponse === false || $userStatus !== 200) {
    http_response_code(502);
    exit('Failed to obtain Google user information.');
}

$user = json_decode($userResponse, true);

// Googleアカウント情報を確認
if (
    !is_array($user) ||
    empty($user['sub']) ||
    empty($user['email']) ||
    ($user['email_verified'] ?? false) !== true
) {
    http_response_code(401);
    exit('Google account verification failed.');
}

try {
    // MySQL接続
    $pdo = getDbConnection();

    // Google IDで登録済みユーザーを検索
    $stmt = $pdo->prepare(
        'SELECT id, google_sub, name, email, language
         FROM users
         WHERE google_sub = :google_sub
         LIMIT 1'
    );

    $stmt->execute([
        ':google_sub' => $user['sub'],
    ]);

    $existingUser = $stmt->fetch();

    // 既に登録されている場合
    if ($existingUser) {
        session_regenerate_id(true);

        $_SESSION['user'] = [
            'id' => $existingUser['id'],
            'google_id' => $existingUser['google_sub'],
            'name' => $existingUser['name'],
            'email' => $existingUser['email'],
            'language' => $existingUser['language'],
            'picture' => $user['picture'] ?? '',
        ];

        unset($_SESSION['pending_google_user']);

        header('Location: /');
        exit;
    }

    // 初回ログインの場合
    // まだDBには登録せず、ニックネーム登録画面へ進む
    $_SESSION['pending_google_user'] = [
        'google_id' => $user['sub'],
        'email' => $user['email'],
        'picture' => $user['picture'] ?? '',
    ];

    header('Location: /nickname.php');
    exit;

} catch (Throwable $e) {
    error_log('Google login DB Error: ' . $e->getMessage());

    http_response_code(500);
    exit('Login processing failed.');
}
