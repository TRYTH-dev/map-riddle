CREATE TABLE quizzes (
    quizID INT PRIMARY KEY AUTO_INCREMENT, -- 主キー（自動連番）
    kankouti VARCHAR(255) NOT NULL,        -- 観光地
    mondai TEXT NOT NULL                   -- 問題
);