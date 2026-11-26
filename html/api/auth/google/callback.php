<?php
declare(strict_types=1);

session_start();

$config = require dirname(__DIR__, 2) .'/config/google.php';
require_once dirname(__DIR__, 2) .'/config/db.php';

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

        header('Location: /map.html');
        exit;
    }

    // ==========================================
    // 初回ログインの場合 (新規登録をここで行う)
    // ==========================================
    
    // Googleから取得した名前を使用する（取得できない場合はデフォルト値を設定）
    $defaultName = $user['name'] ?? 'ゲストユーザー';
    $defaultLanguage = $user['locale'] ?? 'ja'; // 必要に応じてデフォルト言語を設定

    // DBに新規ユーザーとして挿入
    $insertStmt = $pdo->prepare(
        'INSERT INTO users (google_sub, name, email, language)
         VALUES (:google_sub, :name, :email, :language)'
    );

    $insertStmt->execute([
        ':google_sub' => $user['sub'],
        ':name'       => $defaultName,
        ':email'      => $user['email'],
        ':language'   => $defaultLanguage,
    ]);

    // 挿入したユーザーのIDを取得
    $newUserId = $pdo->lastInsertId();

    // セッションハイジャック対策
    session_regenerate_id(true);

    // セッションにログイン情報を保存
    $_SESSION['user'] = [
        'id'        => $newUserId,
        'google_id' => $user['sub'],
        'name'      => $defaultName,
        'email'     => $user['email'],
        'language'  => $defaultLanguage,
        'picture'   => $user['picture'] ?? '',
    ];

    // そのままトップページ等へリダイレクト
    header('Location: html/map.html');
    exit;

} catch (Throwable $e) {
    error_log('Google login DB Error: ' . $e->getMessage());

    http_response_code(500);
    exit('Login processing failed.');
}