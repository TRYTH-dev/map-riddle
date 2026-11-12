<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function getDbConnection(): PDO {
    $host = getenv('DB_HOST') ?: 'db';
    $db   = getenv('DB_NAME') ?: 'tryth_db';
    $user = getenv('DB_USER') ?: 'tryth_user';
    $pass = getenv('DB_PASS') ?: 'tryth_pass';

    $dsn = "mysql:host={$host};dbname={$db};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        return new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        error_log('DB Connection Error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'データベース接続に失敗しました。'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}