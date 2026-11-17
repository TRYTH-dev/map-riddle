<?php
// api/spots.php
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/geo.php';

session_start();
$userId = $_SESSION['user_id'] ?? ($_GET['user_id'] ?? null);

// クエリパラメータ取得
$q = trim($_GET['q'] ?? '観光');
$bbox = trim($_GET['bbox'] ?? '');
$userLat = filter_input(INPUT_GET, 'user_lat', FILTER_VALIDATE_FLOAT);$userLng = filter_input(INPUT_GET, 'user_lng', FILTER_VALIDATE_FLOAT);

// 判定半径（2メートル設定）
const ALLOWED_RADIUS_METERS = 2.0;

if ($bbox === '') {
    jsonResponse(['status' => 'error', 'message' => 'bboxパラメータが必要です'], 400);
    exit;
}

try {
    // 1. PHP側から OpenPOI API を呼び出して施設一覧を取得
    $openPoiUrl = 'https://api.openpoiapi.com/v1/search?' . http_build_query([
        'q'     => $q !== '' ?$q : '観光',
        'bbox'  => $bbox,
        'limit' => 100
    ]);

    $ch = curl_init($openPoiUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_USERAGENT      => 'MapRiddleApp/1.0'
    ]);
    $rawResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($rawResponse === false \vert{}\vert{}$httpCode !== 200) {
        jsonResponse(['status' => 'error', 'message' => '外部スポットAPIの取得に失敗しました'], 502);
        exit;
    }

    $poiData = json_decode($rawResponse, true);
    $places =$poiData['results'] ?? [];

    // 2. DBからユーザーの獲得済みスポットID一覧を取得（ログイン中の場合）
    $acquiredSpotIds = [];
    if ($userId) {
        $stmt =$pdo->prepare("SELECT spot_id FROM user_badges WHERE user_id = :user_id");
        $stmt->execute([':user_id' =>$userId]);
        $acquiredSpotIds = array_flip($stmt->fetchAll(PDO::FETCH_COLUMN));
    }

    // 3. 各スポットに対して現在地からの距離計算（Haversine）＆ 2m以内判定を付与
    $spots = [];
    foreach ($places as $place) {$lat = isset($place['lat']) ? (float)$place['lat'] : null;
        $lng = isset($place['lng']) ? (float)$place['lng'] : null;

        if ($lat === null \vert{}\vert{}$lng === null || !is_finite($lat) \vert{}\vert{} !is_finite($lng)) {
            continue;
        }

        $spotId = (string)($place['id'] ?? md5($lat . ',' .$lng . ($place['name'] ?? '')));$distanceMeters = null;
        $isWithinRange = false;

        // ユーザーの現在地が送られてきている場合、Haversine公式で距離計算
        if ($userLat !== false && $userLng !== false &&$userLat !== null && $userLng !== null) {$distanceMeters = round(
                calculateDistanceMeters($userLat,$userLng, $lat,$lng),
                2
            );
            $isWithinRange = ($distanceMeters <= ALLOWED_RADIUS_METERS);
        }

        $spots[] = [
            'spot_id'          => $spotId,
            'name'             => $place['name'] ?? '名称不明の施設',
            'address'          => $place['address'] ?? trim(($place['prefecture'] ?? '') . ' ' . ($place['city'] ?? '')),
            'category'         => $place['category'] ?? '施設',
            'latitude'         => $lat,
            'longitude'        => $lng,
            'distance_m'       => $distanceMeters,   // 現在地からの距離(m)
            'allowed_radius_m' => ALLOWED_RADIUS_METERS, // 2.0m
            'is_within_range'  => $isWithinRange,    // 2m以内なら true
            'is_acquired'      => isset($acquiredSpotIds[$spotId]) // バッジ取得済みか
        ];
    }

    jsonResponse([
        'status' => 'success',
        'count'  => count($spots),
        'spots'  => $spots
    ]);

} catch (Exception $e) {
    jsonResponse(['status' => 'error', 'message' => 'スポット処理中にエラーが発生しました'], 500);
}