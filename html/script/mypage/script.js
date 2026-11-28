    // 初期データ（画像の表示内容を再現）
    const areaData = [
      {
        id: 1,
        code: "第1エリア",
        name: "三宮・元町...",
        fullName: "三宮・元町 観光スポット初級クイズ",
        date: "2024/04/15",
        unlocked: true,
        expanded: false,
        showFractionWhenCollapsed: false,
        spots: [
          {
            title: "スポット1: 旧居留地とレトロ建築",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 3,
            attemptCount: 3,
            questions: [
              { q: "神戸旧居留地が開設されたのは西暦何年？", options: ["1868年", "1889年", "1901年"], answer: 0, exp: "1868年（慶応3年12月）の神戸開港と同時に外国人居留地が設けられました。" },
              { q: "旧居留地十五番館は現在何として活用されている？", options: ["レストラン", "市役所分庁舎", "水族館"], answer: 0, exp: "国の重要文化財に指定されており、現在はレストランとして営業しています。" }
            ]
          }
        ]
      },
      {
        id: 2,
        code: "第2エリア",
        name: "北野異人館...",
        fullName: "北野異人館街 観光スポット初級クイズ",
        date: "2024/04/16",
        unlocked: true,
        expanded: false,
        showFractionWhenCollapsed: false,
        spots: [
          {
            title: "スポット1: 風見鶏の館と萌黄の館",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 2,
            attemptCount: 2,
            questions: [
              { q: "「風見鶏の館」の外壁の特徴は？", options: ["赤レンガ", "白い漆喰", "青緑色の下見板"], answer: 0, exp: "北野異人館で唯一現存する赤レンガ外壁の建物です。" },
              { q: "「萌黄の館」の建築当時の所有者は誰？", options: ["アメリカ総領事ハンター・シャープ", "ドイツ人貿易商トーマス", "イギリス人医師"], answer: 0, exp: "1903年にアメリカ総領事ハンター・シャープ氏の邸宅として建てられました。" }
            ]
          }
        ]
      },
      {
        id: 3,
        code: "第3エリア",
        name: "メリケンパー...",
        fullName: "メリケンパーク・ハーバーランド初級クイズ",
        date: "2024/04/17",
        unlocked: true,
        expanded: false,
        showFractionWhenCollapsed: false,
        spots: [
          {
            title: "スポット1: 神戸ポートタワーと海洋博物館",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 4,
            attemptCount: 4,
            questions: [
              { q: "神戸ポートタワーの独特な構造は何と呼ばれている？", options: ["鼓（つづみ）型パイプ構造", "トラス構造", "ドーム構造"], answer: 0, exp: "和楽器の鼓を長くしたような双曲面構造（パイプ構造）が特徴です。" },
              { q: "メリケンパークの名称の由来となった「メリケン波止場」は何の訛り？", options: ["アメリカン", "マーメイド", "マリン"], answer: 0, exp: "明治時代にアメリカ領事館が近くにあり、「アメリカン」が訛って「メリケン」と呼ばれました。" }
            ]
          }
        ]
      },
      {
        id: 4,
        code: "第4エリア",
        name: "有馬温...",
        fullName: "有馬温泉 観光スポット初級クイズ",
        date: "2024/04/18",
        unlocked: true,
        expanded: true,
        showFractionWhenCollapsed: true,
        spots: [
          {
            title: "スポット1: 金の湯・銀の湯の泉質マスター",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 7,
            attemptCount: 7,
            questions: [
              { q: "有馬温泉の「金泉（金の湯）」が赤褐色になる主な成分は？", options: ["鉄分と塩分", "硫黄", "炭酸ガス"], answer: 0, exp: "湧出時は無色透明ですが、空気に触れると含まれる鉄分が酸化して赤褐色になります。" },
              { q: "「銀泉（銀の湯）」の主な泉質はどれ？", options: ["炭酸泉・ラジウム泉", "酸性緑礬泉", "泥湯"], answer: 0, exp: "銀泉は無色透明で、二酸化炭素を含む炭酸泉やラドンを含むラジウム泉があります。" }
            ]
          },
          {
            title: "スポット2: 太閤秀吉と有馬の歴史",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 2,
            attemptCount: 3,
            questions: [
              { q: "豊臣秀吉が有馬温泉で大規模な改修を行ったきっかけは？", options: ["慶長伏見地震での被災復旧", "関ヶ原の戦いの祝勝", "朝鮮出兵の軍資金調達"], answer: 0, exp: "1596年の慶長伏見地震で被害を受けた有馬温泉を復興させるため大規模改修を行いました。" },
              { q: "秀吉の正室・ねね（北政所）の別邸跡に建てられた寺院は？", options: ["念仏寺", "温泉寺", "極楽寺"], answer: 0, exp: "念仏寺は北政所の別邸跡にあり、樹齢約300年の沙羅双樹でも有名です。" }
            ]
          },
          {
            title: "スポット3: 温泉街名物と散策（炭酸せんべい・有馬サイダー...",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 2,
            attemptCount: 1,
            questions: [
              { q: "有馬名物「炭酸せんべい」の生地に使われていないものは？", options: ["卵・バター", "小麦粉", "炭酸泉（炭酸水）"], answer: 0, exp: "伝統的な炭酸せんべいは卵やバターを使わず、小麦粉・砂糖・でんぷん・塩と炭酸水で作られます。" },
              { q: "「有馬サイダー てっぽう水」の「てっぽう水」の由来は？", options: ["栓を抜く音が鉄砲に似ていたから", "鉄砲職人が作ったから", "鉄分が豊富だから"], answer: 0, exp: "炭酸ガスが強く、王冠を抜く時の「ポン！」という音が鉄砲の音に似ていたため名付けられました。" }
            ]
          }
        ]
      },
      {
        id: 5,
        code: "第5エリア",
        name: "六甲山・摩耶...",
        fullName: "六甲山・摩耶山 観光スポット初級クイズ",
        date: "2024/04/19",
        unlocked: true,
        expanded: false,
        showFractionWhenCollapsed: false,
        spots: [
          {
            title: "スポット1: 掬星台と1000万ドルの夜景",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 2,
            attemptCount: 2,
            questions: [
              { q: "摩耶山「掬星台（きくせいだい）」の名前の由来は？", options: ["手を伸ばせば星を掬（すく）えそうだから", "星形の展望台だから", "天体観測所があったから"], answer: 0, exp: "「手で星を掬える」ほど美しい夜景・星空が広がることから名付けられました。" },
              { q: "六甲山開発の父と呼ばれるイギリス人貿易商は誰？", options: ["アーサー・ヘスケス・グルーム", "トーマス・グラバー", "エドワード・ハズレット・ハンター"], answer: 0, exp: "1895年に六甲山上に最初の別荘を建て、近代リゾート開発の礎を築きました。" }
            ]
          }
        ]
      },
      {
        id: 6,
        code: "第6エリア",
        name: "灘五郷・酒蔵...",
        fullName: "灘五郷・酒蔵めぐり 初級クイズ",
        date: "2024/04/20",
        unlocked: true,
        expanded: false,
        showFractionWhenCollapsed: false,
        spots: [
          {
            title: "スポット1: 宮水と酒造りの歴史",
            q1: true,
            q2: true,
            score: 100,
            achievedCount: 5,
            attemptCount: 5,
            questions: [
              { q: "灘の酒造りに欠かせない名水「宮水」が湧き出る場所は？", options: ["西宮市", "明石市", "淡路市"], answer: 0, exp: "西宮市の沿岸部で湧き出る硬水「宮水」は、リンやカリウムが豊富で発酵を促します。" },
              { q: "冬に六甲山から吹き下ろす、酒造りに適した冷たい風を何と呼ぶ？", options: ["六甲おろし", "海風（うみかぜ）", "やませ"], answer: 0, exp: "冷たく乾燥した「六甲おろし」が雑菌の繁殖を抑え、吟醸造りに適した環境を作ります。" }
            ]
          }
        ]
      }
    ];

    const areasContainer = document.getElementById("areasContainer");
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    function calculateAreaStats(area) {
      let totalQ = 0;
      let correctQ = 0;
      area.spots.forEach(spot => {
        totalQ += 2;
        if (spot.q1) correctQ += 1;
        if (spot.q2) correctQ += 1;
      });
      const pct = totalQ === 0 ? 0 : Math.round((correctQ / totalQ) * 100);
      return { totalQ, correctQ, pct };
    }

    function renderAreas() {
      areasContainer.innerHTML = "";

      areaData.forEach(area => {
        const stats = calculateAreaStats(area);
        const item = document.createElement("div");
        item.className = `area-item ${area.expanded ? "active" : ""}`;

        const pillLabel = (area.expanded || area.showFractionWhenCollapsed)
          ? `${stats.correctQ}/${stats.totalQ}問 (${stats.pct}%)`
          : `${stats.pct}%`;

        // スポット一覧HTML生成
        const spotsHtml = area.spots.map(spot => {
          const correctCount = (spot.q1 ? 1 : 0) + (spot.q2 ? 1 : 0);
          const passed = correctCount === 2;
          return `
            <div class="spot-card">
              <div class="spot-top">
                <div class="spot-title">${spot.title}</div>
                <span class="pass-badge ${passed ? "" : "unpassed"}">${passed ? "合格" : "再挑戦"}</span>
              </div>
              <div class="spot-middle">
                <span class="q-badge ${spot.q1 ? "" : "wrong"}">Q1 ${spot.q1 ? "◯ 正解" : "✕ 不正解"}</span>
                <span class="q-badge ${spot.q2 ? "" : "wrong"}">Q2 ${spot.q2 ? "◯ 正解" : "✕ 不正解"}</span>
                <span class="correct-summary">2問中${correctCount}問正解（全2問）</span>
              </div>
              <div class="spot-bottom">
                <div>得点: <span class="score-val">${spot.score}点</span> / 100</div>
                <div>${spot.achievedCount}回達成</div>
                <div>${spot.attemptCount}回受験</div>
              </div>
            </div>
          `;
        }).join("");

        item.innerHTML = `
          <div class="area-header" data-id="${area.id}">
            <div class="area-title-group">
              <span class="pin-icon">📍</span>
              <span class="area-number">${area.code}</span>
              <span class="area-name">${area.name}</span>
            </div>
            <div class="area-controls">
              <span class="progress-pill">🎯 ${pillLabel}</span>

            </div>
          </div>
          <div class="area-detail">
            <div class="detail-meta">
              <span>${area.fullName}（全2問構成 / 全2問解答済み）</span>
              <span>${area.date}</span>
            </div>
            <div class="spot-list">${spotsHtml}</div>
            <div class="detail-actions">
              <button class="btn-outline" data-explain-id="${area.id}">2問の解答・解説を見る</button>
              <button class="btn-solid" data-retry-id="${area.id}">再挑戦 / 復習する</button>
            </div>
          </div>
        `;

        areasContainer.appendChild(item);
      });
    }

    // イベント委譲
    areasContainer.addEventListener("click", (e) => {
      // 解除ボタン
      const unlockBtn = e.target.closest("[data-unlock-id]");
      if (unlockBtn) {
        e.stopPropagation();
        const id = Number(unlockBtn.dataset.unlockId);
        const area = areaData.find(a => a.id === id);
        area.unlocked = !area.unlocked;
        renderAreas();
        return;
      }

      // 解説ボタン
      const explainBtn = e.target.closest("[data-explain-id]");
      if (explainBtn) {
        e.stopPropagation();
        openExplainModal(Number(explainBtn.dataset.explainId));
        return;
      }

      // 再挑戦ボタン
      const retryBtn = e.target.closest("[data-retry-id]");
      if (retryBtn) {
        e.stopPropagation();
        openRetryModal(Number(retryBtn.dataset.retryId));
        return;
      }

      // アコーディオン開閉
      const header = e.target.closest(".area-header");
      if (header) {
        const id = Number(header.dataset.id);
        const area = areaData.find(a => a.id === id);
        area.expanded = !area.expanded;
        renderAreas();
      }
    });

    // 解答・解説モーダル
    function openExplainModal(areaId) {
      const area = areaData.find(a => a.id === areaId);
      modalTitle.textContent = `${area.code} 解答・解説`;
      modalBody.innerHTML = area.spots.map(spot => `
        <div class="quiz-block">
          <div class="quiz-spot-label">${spot.title}</div>
          ${spot.questions.map((qItem, idx) => `
            <div style="margin-top:8px;">
              <div class="quiz-question">Q${idx + 1}. ${qItem.q}</div>
              <div style="font-size:12px; color:#059669; font-weight:700;">正解：${qItem.options[qItem.answer]}</div>
              <div class="explanation-text">${qItem.exp}</div>
            </div>
          `).join("")}
        </div>
      `).join("");
      modalBackdrop.classList.add("open");
    }

    // 再挑戦クイズモーダル
    function openRetryModal(areaId) {
      const area = areaData.find(a => a.id === areaId);
      const targetSpot = area.spots[0]; // 代表スポットを出題
      modalTitle.textContent = `再挑戦：${targetSpot.title}`;

      const selectedAnswers = [null, null];

      function renderQuizForm() {
        modalBody.innerHTML = `
          ${targetSpot.questions.map((qItem, qIdx) => `
            <div class="quiz-block">
              <div class="quiz-question">Q${qIdx + 1}. ${qItem.q}</div>
              ${qItem.options.map((opt, oIdx) => `
                <button type="button" class="quiz-option ${selectedAnswers[qIdx] === oIdx ? "selected" : ""}" data-q="${qIdx}" data-o="${oIdx}">
                  ${opt}
                </button>
              `).join("")}
            </div>
          `).join("")}
          <button class="btn-solid" style="width:100%; padding:11px; font-size:13px;" id="submitQuizBtn">採点する</button>
        `;

        modalBody.querySelectorAll(".quiz-option").forEach(btn => {
          btn.addEventListener("click", () => {
            selectedAnswers[Number(btn.dataset.q)] = Number(btn.dataset.o);
            renderQuizForm();
          });
        });

        document.getElementById("submitQuizBtn").addEventListener("click", () => {
          if (selectedAnswers.includes(null)) {
            alert("2問すべて選択してください。");
            return;
          }
          const q1Ok = selectedAnswers[0] === targetSpot.questions[0].answer;
          const q2Ok = selectedAnswers[1] === targetSpot.questions[1].answer;
          targetSpot.q1 = q1Ok;
          targetSpot.q2 = q2Ok;
          targetSpot.score = (q1Ok ? 50 : 0) + (q2Ok ? 50 : 0);
          targetSpot.attemptCount += 1;
          if (q1Ok && q2Ok) targetSpot.achievedCount += 1;

          renderAreas();
          modalBackdrop.classList.remove("open");
        });
      }

      renderQuizForm();
      modalBackdrop.classList.add("open");
    }

    // モーダル閉じる
    document.getElementById("closeModalBtn").addEventListener("click", () => {
      modalBackdrop.classList.remove("open");
    });
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove("open");
    });

    // アカウント切替デモ
    let isDefaultUser = true;
    document.getElementById("switchAccountBtn").addEventListener("click", () => {
      isDefaultUser = !isDefaultUser;
      document.getElementById("userName").textContent = isDefaultUser ? "山田 太郎" : "神戸 花子";
      document.getElementById("userEmail").textContent = isDefaultUser ? "taro.yamada@gmail.com" : "hanako.kobe@gmail.com";
    });

    renderAreas();