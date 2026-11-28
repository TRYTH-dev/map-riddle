SET NAMES utf8mb4;
START TRANSACTION;

-- スポット一覧
INSERT INTO spots (name, description, category, latitude, longitude, badge_name, badge_image_url)
WITH seed (name, category, latitude, longitude) AS (VALUES
  ROW('神戸ポートタワー', 'ベイエリア', 34.6826250, 135.1866940),
  ROW('メリケンパーク', 'ベイエリア', 34.6826219, 135.1887653),
  ROW('神戸ハーバーランド', 'ベイエリア', 34.6793260, 135.1826530),
  ROW('南京町', 'グルメ・街並み', 34.6881670, 135.1881110),
  ROW('神戸旧居留地', '歴史・街並み', 34.6872222, 135.1929167),
  ROW('生田神社', '神社仏閣', 34.6947123, 135.1910456),
  ROW('北野異人館街 (風見鶏の館)', '歴史・建築', 34.7013722, 135.1895028),
  ROW('神戸布引ハーブ園', '庭園・自然', 34.7170944, 135.1912389),
  ROW('神戸どうぶつ王国', '動物園', 34.6541100, 135.2227960),
  ROW('摩耶山 掬星台', '展望・自然', 34.7341667, 135.2064722),
  ROW('有馬温泉', '温泉', 34.7968080, 135.2478780),
  ROW('六甲山', '展望・自然', 34.7644030, 135.2464550)
)
SELECT seed.name, '兵庫県神戸市の観光スポット。', seed.category, seed.latitude, seed.longitude,
       CONCAT(seed.name, ' バッジ'), ''
FROM seed
WHERE NOT EXISTS (
  SELECT 1 FROM spots WHERE spots.name = seed.name
    OR (seed.name = '神戸ハーバーランド' AND spots.name IN ('神戸ハーバランド'))
    OR (seed.name = '南京町' AND spots.name IN ('南京町（長安門・広場）'))
    OR (seed.name = '神戸旧居留地' AND spots.name IN ('神戸居留地', '神戸旧居瘤地'))
    OR (seed.name = '北野異人館街 (風見鶏の館)' AND spots.name IN ('北野異人館街（風見鶏の館）'))
    OR (seed.name = '摩耶山 掬星台' AND spots.name IN ('摩耶山・掬星台'))
);

-- 神戸ポートタワーのクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '神戸ポートタワー' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '1963年に開業した神戸ポートタワーの独特な形状は、日本の伝統的なある楽器をイメージして設計されました。その楽器とは何でしょう？',
  '琴（こと）',
  '鼓（つづみ）',
  '三味線（しゃみせん）',
  '琵琶（びわ）',
  2,
  '日本の伝統楽器である鼓（つづみ）を長くしたような美しい双曲面構造をしています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('1963年に開業した神戸ポートタワーの独特な形状は、日本の伝統的なある楽器をイメージして設計されました。その楽器とは何でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '世界で初めてパイプ構造（双曲面構造）を採用した観光タワーである神戸ポートタワーの高さは何メートルでしょう？',
  '108m',
  '150m',
  '222m',
  '333m',
  1,
  '煩悩の数と同じ108mの高さです。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('世界で初めてパイプ構造（双曲面構造）を採用した観光タワーである神戸ポートタワーの高さは何メートルでしょう？' AS BINARY)
  );

-- メリケンパークのクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = 'メリケンパーク' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  'メリケンパークの「メリケン」とは、開港当時にこの近くに置かれていたある国の領事館（メリケン波止場）に由来します。どこの国でしょう？',
  'イギリス',
  'フランス',
  'アメリカ',
  'オランダ',
  3,
  '「アメリカン」が訛って「メリケン」と呼ばれるようになりました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('メリケンパークの「メリケン」とは、開港当時にこの近くに置かれていたある国の領事館（メリケン波止場）に由来します。どこの国でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  'メリケンパークにある、白く巨大なアルファベットで「BE KOBE」と書かれたモニュメントが設置されたのは、どんな節目を記念してのことでしょう？',
  '神戸市制100周年',
  '神戸開港150年',
  '阪神・淡路大震災から20年',
  '明石海峡大橋の開通20周年',
  2,
  '2017年（平成29年）の神戸開港150年を記念して設置されました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('メリケンパークにある、白く巨大なアルファベットで「BE KOBE」と書かれたモニュメントが設置されたのは、どんな節目を記念してのことでしょう？' AS BINARY)
  );

-- 神戸ハーバーランドのクイズ
SET @spot_id = (SELECT id FROM spots WHERE name IN ('神戸ハーバーランド', '神戸ハーバランド') ORDER BY FIELD(name, '神戸ハーバーランド', '神戸ハーバランド'), id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸ハーバーランドにある商業施設「umie（ウミエ）」の海側に面したエリアで、煉瓦倉庫や大観覧車があるゾーンの名前は何でしょう？',
  'モザイク',
  'カレイド',
  'パレット',
  'キャンバス',
  1,
  '海沿いの開放的なショッピング・グルメエリア「umie MOSAIC」です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸ハーバーランドにある商業施設「umie（ウミエ）」の海側に面したエリアで、煉瓦倉庫や大観覧車があるゾーンの名前は何でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸ハーバーランドの一角にある「煉瓦倉庫」は、明治時代には何のために使われていた建物でしょう？',
  'ビール工場',
  '貨物倉庫',
  '造船所の事務所',
  '銀行の金庫',
  2,
  '神戸港に荷揚げされた貨物を保管するために1890年代に建てられました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸ハーバーランドの一角にある「煉瓦倉庫」は、明治時代には何のために使われていた建物でしょう？' AS BINARY)
  );

-- 南京町のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name IN ('南京町', '南京町（長安門・広場）') ORDER BY FIELD(name, '南京町', '南京町（長安門・広場）'), id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸の南京町は「日本三大中華街」の一つに数えられます。残りの2つは「横浜中華街」と、どこの中華街でしょう？',
  '函館元町中華街',
  '名古屋栄中華街',
  '博多天神中華街',
  '長崎新地中華街',
  4,
  '横浜中華街・神戸南京町・長崎新地中華街が日本三大中華街です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸の南京町は「日本三大中華街」の一つに数えられます。残りの2つは「横浜中華街」と、どこの中華街でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '南京町の中心にある「あづまや」の周辺には、12体の石像が並んでいます。これらは何をモチーフにしているでしょう？',
  '七福神と五穀豊穣の神',
  '十二支（干支）',
  '三国志の武将',
  '歴代の皇帝',
  2,
  '十二支の石像に加え、なぜかパンダの像も1体並んでいます。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('南京町の中心にある「あづまや」の周辺には、12体の石像が並んでいます。これらは何をモチーフにしているでしょう？' AS BINARY)
  );

-- 神戸旧居留地のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name IN ('神戸旧居留地', '神戸居留地', '神戸旧居瘤地') ORDER BY FIELD(name, '神戸旧居留地', '神戸居留地', '神戸旧居瘤地'), id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '1868年の神戸開港に伴い設けられた外国人居留地。現在も重厚な近代建築が立ち並びますが、かつて居留地を設計したイギリス人技師の名前は何でしょう？',
  'トーマス・グラバー',
  'ジョサイア・コンドル',
  'ジョン・ウィリアム・ハート',
  'ウィリアム・メレル・ヴォーリズ',
  3,
  'J.W.ハートによって下水道や街路樹を備えた近代的な街並みが設計されました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('1868年の神戸開港に伴い設けられた外国人居留地。現在も重厚な近代建築が立ち並びますが、かつて居留地を設計したイギリス人技師の名前は何でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸旧居留地にある「旧居留地十五番館」は、明治時代の居留地時代の建物として唯一現存するもので、国の何に指定されているでしょう？',
  '重要文化財',
  '国宝',
  '特別史跡',
  '登録有形文化財',
  1,
  '旧アメリカ領事館としても使われた建物で、国の重要文化財に指定されています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸旧居留地にある「旧居留地十五番館」は、明治時代の居留地時代の建物として唯一現存するもので、国の何に指定されているでしょう？' AS BINARY)
  );

-- 生田神社のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '生田神社' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '生田神社の境内にある「生田の森」は、歴史上有名なある合戦の舞台となりました。源氏と平氏が戦った何の戦いでしょう？',
  '壇ノ浦の戦い',
  '屋島の戦い',
  '宇治川の戦い',
  '一ノ谷の戦い',
  4,
  '源平合戦「一ノ谷の戦い」で平氏軍が陣を敷いた場所として知られます。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('生田神社の境内にある「生田の森」は、歴史上有名なある合戦の舞台となりました。源氏と平氏が戦った何の戦いでしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '「神戸（こうべ）」という地名の由来は、生田神社を守る人々（または神社の経済を支える民戸）を指すある言葉が変化したものとされています。その言葉とは何でしょう？',
  'かんべ',
  'しんべ',
  'じんべ',
  'こうど',
  1,
  '生田神社の「神封戸（かんべ）」が転じて「こうべ」になったといわれています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('「神戸（こうべ）」という地名の由来は、生田神社を守る人々（または神社の経済を支える民戸）を指すある言葉が変化したものとされています。その言葉とは何でしょう？' AS BINARY)
  );

-- 北野異人館街 (風見鶏の館)のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name IN ('北野異人館街 (風見鶏の館)', '北野異人館街（風見鶏の館）') ORDER BY FIELD(name, '北野異人館街 (風見鶏の館)', '北野異人館街（風見鶏の館）'), id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '「風見鶏の館」を建てたドイツ人貿易商の名前は何でしょう？（館の正式名称にもなっています）',
  'シュリーマン',
  'トーマス',
  'ライン',
  'ゲーテ',
  2,
  'ゴットフリート・トーマス氏の自邸として建てられ、正式名称は「旧トーマス住宅」です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('「風見鶏の館」を建てたドイツ人貿易商の名前は何でしょう？（館の正式名称にもなっています）' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '風見鶏の館の屋根の上にある風見鶏には、風向きを知る以外にどのような意味（役割）が込められているでしょう？',
  '商売繁盛',
  '子孫繁栄',
  '魔除け',
  '航海の安全',
  3,
  '雄鶏は警戒心が強く、悪いものを追い払う魔除けの意味が込められています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('風見鶏の館の屋根の上にある風見鶏には、風向きを知る以外にどのような意味（役割）が込められているでしょう？' AS BINARY)
  );

-- 神戸布引ハーブ園のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '神戸布引ハーブ園' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸布引ハーブ園へアクセスするために乗る乗り物は何でしょう？',
  'ケーブルカー',
  'ロープウェイ',
  'モノレール',
  '観光リフト',
  2,
  '新神戸駅近くから「神戸布引ロープウェイ」に乗って約10分で山頂へ到着します。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸布引ハーブ園へアクセスするために乗る乗り物は何でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  'ハーブ園の周辺には「日本三大神滝」の一つに数えられる名瀑があります。その滝の名前は何でしょう？',
  '華厳の滝',
  '那智の滝',
  '袋田の滝',
  '布引の滝',
  4,
  '雄滝・雌滝・夫婦滝・鼓ヶ滝の4つの滝の総称で、日本三大神滝の一つです。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('ハーブ園の周辺には「日本三大神滝」の一つに数えられる名瀑があります。その滝の名前は何でしょう？' AS BINARY)
  );

-- 神戸どうぶつ王国のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '神戸どうぶつ王国' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸どうぶつ王国はポートアイランドにありますが、2014年に現在の名称にリニューアルする前は何という名前の施設だったでしょう？',
  '神戸花鳥園',
  '神戸サファリパーク',
  'ポートアイランド動物園',
  '神戸熱帯植物園',
  1,
  '2006年に「神戸花鳥園」として開園し、2014年に「神戸どうぶつ王国」へ生まれ変わりました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸どうぶつ王国はポートアイランドにありますが、2014年に現在の名称にリニューアルする前は何という名前の施設だったでしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '神戸どうぶつ王国で飼育されている、「動かない鳥」として有名な大型の鳥は何でしょう？',
  'フラミンゴ',
  'ペリカン',
  'ハシビロコウ',
  'エミュー',
  3,
  '鋭い目つきとほとんど動かない姿で人気の大型鳥類です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('神戸どうぶつ王国で飼育されている、「動かない鳥」として有名な大型の鳥は何でしょう？' AS BINARY)
  );

-- 摩耶山 掬星台のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name IN ('摩耶山 掬星台', '摩耶山・掬星台') ORDER BY FIELD(name, '摩耶山 掬星台', '摩耶山・掬星台'), id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '摩耶山・掬星台からの夜景は「日本三大夜景」の一つに数えられます。あとの2つは函館山（北海道）と、どこの山でしょう？',
  '藻岩山（北海道）',
  '若草山（奈良県）',
  '皿倉山（福岡県）',
  '稲佐山（長崎県）',
  4,
  '函館山・摩耶山・稲佐山の夜景が日本三大夜景とされています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('摩耶山・掬星台からの夜景は「日本三大夜景」の一つに数えられます。あとの2つは函館山（北海道）と、どこの山でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '展望広場「掬星台（きくせいだい）」という名前の由来は、「手を伸ばせば〇〇を掬（すく）えそう」なほど美しい景色から来ています。〇〇に入る言葉は何でしょう？',
  '海',
  '雲',
  '星',
  '夢',
  3,
  '「手で星を掬（すく）える」ほどの絶景であることが名前の由来です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('展望広場「掬星台（きくせいだい）」という名前の由来は、「手を伸ばせば〇〇を掬（すく）えそう」なほど美しい景色から来ています。〇〇に入る言葉は何でしょう？' AS BINARY)
  );

-- 有馬温泉のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '有馬温泉' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '有馬温泉は「日本三古湯」の一つです。残りの2つは道後温泉（愛媛県）と、どこの温泉でしょう？',
  '草津温泉（群馬県）',
  '下呂温泉（岐阜県）',
  '白浜温泉（和歌山県）',
  '別府温泉（大分県）',
  3,
  '日本書紀にも登場する有馬温泉・道後温泉・白浜温泉が日本三古湯です。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('有馬温泉は「日本三古湯」の一つです。残りの2つは道後温泉（愛媛県）と、どこの温泉でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '有馬温泉の名物のお湯には、鉄分と塩分を含み茶褐色に濁った「金泉」と、無色透明な「何泉」の2種類があるでしょう？',
  '銀泉',
  '銅泉',
  '白泉',
  '玉泉',
  1,
  '茶褐色の「金泉」に対し、炭酸泉やラジウム泉の無色透明なお湯は「銀泉」と呼ばれます。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('有馬温泉の名物のお湯には、鉄分と塩分を含み茶褐色に濁った「金泉」と、無色透明な「何泉」の2種類があるでしょう？' AS BINARY)
  );

-- 六甲山のクイズ
SET @spot_id = (SELECT id FROM spots WHERE name = '六甲山' ORDER BY id LIMIT 1);

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '1903年（明治36年）、六甲山に日本で初めて作られたスポーツ施設は何でしょう？',
  'スキー場',
  'テニスコート',
  'ゴルフ場',
  'スケートリンク',
  3,
  'イギリス人貿易商アーサー・グルームらによって日本初のゴルフ場「神戸ゴルフ倶楽部」が開設されました。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('1903年（明治36年）、六甲山に日本で初めて作られたスポーツ施設は何でしょう？' AS BINARY)
  );

INSERT INTO quizzes (spot_id, question_text, choice_1, choice_2, choice_3, choice_4, correct_choice, explanation, question_order)
SELECT id,
  '六甲山の自然を体感できる展望台「自然体感展望台 六甲枝垂れ（しだれ）」は、山の頂上に立つ何に見立てて設計されたでしょう？',
  '一本の大樹',
  '巨大な鳥の巣',
  '咲いたばかりの桜',
  '雲の塊',
  1,
  'ヒノキのフレームで覆われたドームが「山の上に立つ一本の大樹」を表現しています。',
  (SELECT COALESCE(MAX(question_order), 0) + 1 FROM quizzes WHERE spot_id = @spot_id)
FROM spots WHERE id = @spot_id
  AND NOT EXISTS (
    SELECT 1 FROM quizzes WHERE spot_id = @spot_id
      AND CAST(question_text AS BINARY) = CAST('六甲山の自然を体感できる展望台「自然体感展望台 六甲枝垂れ（しだれ）」は、山の頂上に立つ何に見立てて設計されたでしょう？' AS BINARY)
  );

COMMIT;

-- 新規スポットの参考座標
-- 神戸ポートタワー / db/init.sql
-- メリケンパーク / https://opd.opendata-japan.com/facility_and_place_v5s?category_code=cat_hinanjo&facility_id=GV-D2BM-1XVV-HHM2
-- 神戸ハーバーランド / umie: https://www.navitime.co.jp/poi?spot=02301-1900054n
-- 南京町 / db/init.sql
-- 神戸旧居留地 / 神戸市立博物館: https://mapfan.com/spots/SC3WY%2CJ%2CPU
-- 生田神社 / db/init.sql
-- 北野異人館街 (風見鶏の館) / https://mapfan.com/spots/SYHC%2CJ%2CNC09E
-- 神戸布引ハーブ園 / https://mapfan.com/spots/SCCWH%2CJ%2CXD
-- 神戸どうぶつ王国 / https://www.navitime.co.jp/poi?spot=02301-1301271
-- 摩耶山 掬星台 / https://web.pref.hyogo.lg.jp/ks20/documents/hyogoviewguidebook.pdf
-- 有馬温泉 / 金の湯: https://www.navitime.co.jp/poi?spot=02301-1900071
-- 六甲山 / 六甲枝垂れ: https://nightview.useless-landscape.com/details/rokko-shidare/map/
