SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    google_sub VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    language VARCHAR(10) NOT NULL DEFAULT 'ja',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS spots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    checkin_radius_m INT NOT NULL DEFAULT 150,
    badge_name VARCHAR(100) NOT NULL,
    badge_image_url VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quizzes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    spot_id BIGINT NOT NULL,
    question_order INT NOT NULL DEFAULT 1,
    question_text TEXT NOT NULL,
    choice_1 VARCHAR(255) NOT NULL,
    choice_2 VARCHAR(255) NOT NULL,
    choice_3 VARCHAR(255) NOT NULL,
    choice_4 VARCHAR(255) NOT NULL,
    correct_choice TINYINT NOT NULL,
    explanation TEXT NOT NULL,
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_badges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    spot_id BIGINT NOT NULL,
    acquired_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_spot (user_id, spot_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quiz_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    selected_choice TINYINT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    score_earned INT NOT NULL DEFAULT 0,
    answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 動作確認用テストユーザー＆先行3スポットデータ
INSERT INTO users (id, google_sub, name, email) VALUES
(1, 'dummy-sub-001', 'テスト観光客', 'test@example.com');

INSERT INTO spots (id, name, description, category, latitude, longitude, checkin_radius_m, badge_name, badge_image_url) VALUES
(1, '生田神社', '「神戸」の地名の由来となった縁結びの名社。', '神社仏閣', 34.6947123, 135.1910456, 150, '生田神社 縁結びバッジ', '/assets/badges/spot_01.png'),
(2, '神戸ポートタワー', '鼓をモチーフにした美しい曲線の観光タワー。', 'ベイエリア', 34.6826250, 135.1866940, 150, 'ポートタワー 鉄塔の美女バッジ', '/assets/badges/spot_02.png'),
(3, '南京町（長安門・広場）', '日本三大チャイナタウンの一つ。', 'グルメ・街並み', 34.6881670, 135.1881110, 150, '南京町 パンダバッジ', '/assets/badges/spot_03.png');

INSERT INTO quizzes (spot_id, question_order, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation) VALUES
(1, 1, '生田神社の本殿北側に広がる鎮守の森の名前は？', '生田の森', '湊川の森', '六甲の森', '布引の森', 1, '樹齢約500年のご神木がある「生田の森」が広がっています。'),
(2, 1, '神戸ポートタワーの形状のモチーフとなった日本の伝統楽器は？', '三味線', '鼓（つづみ）', '琴', '尺八', 2, '和楽器の「鼓」を長くしたような双曲面構造をしています。'),
(3, 1, '南京町の東側入口（大丸神戸店側）に建つ門の名前は？', '長安門', '西安門', '南楼門', '善隣門', 1, '東の入口は「長安門」、西の入口は「西安門」と呼ばれています。');