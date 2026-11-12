<?php
declare(strict_types=1);

require_once __DIR__ . '/config/db.php';

$pdo = getDbConnection();
$stmt = $pdo->query('SELECT COUNT(*) AS spot_count FROM spots');
$row = $stmt->fetch();

echo json_encode([
    'status' => 'ok',
    'message' => 'PHPとMySQLの接続に成功しました！',
    'spot_count' => (int)$row['spot_count']
], JSON_UNESCAPED_UNICODE);