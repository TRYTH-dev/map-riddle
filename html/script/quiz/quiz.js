(() => {
  "use strict";

  const requestedSpotId = new URLSearchParams(location.search).get("spot_id") || "2";
  const views = Object.fromEntries([...document.querySelectorAll("[data-view]")]
    .map(view => [view.dataset.view, view]));
  const heading = document.querySelector("#quiz-heading");
  const form = views.question;
  const submit = document.querySelector("#quiz-submit");
  const hint = document.querySelector("#quiz-hint");
  const hintContent = document.querySelector("#hint-content");
  const claim = document.querySelector("#claim-stamp-btn");
  const retry = document.querySelector("#quiz-retry");
  const startOver = document.querySelector("#quiz-start-over");
  const letters = ["A", "B", "C", "D"];

  let spot = null;
  let activeView = "question";
  let questionIndex = 0;
  let correctCount = 0;

  // 初期化：データベース（API）からスポットとクイズを取得
  init();

  async function init() {
    try {
      // ▼ バックエンドのAPIパスに合わせてURLを調整してください
      const response = await fetch(`/api/spots/${encodeURIComponent(requestedSpotId)}/quiz`);
      if (!response.ok) {
        throw new Error(`データの取得に失敗しました (HTTP ${response.status})`);
      }

      const data = await response.json();

      // DBのカラム形式（choice_1〜4, correct_choice など）がそのまま返ってきた場合にも対応
      spot = {
        id: String(data.id),
        name: data.name,
        description: data.description || "兵庫県神戸市の観光スポット。",
        category: data.category || "",
        badge: data.badge || data.badge_name || `${data.name} バッジ`,
        questions: (data.questions || []).map(q => ({
          text: q.text ?? q.question_text,
          choices: q.choices ?? [q.choice_1, q.choice_2, q.choice_3, q.choice_4],
          correct: q.correct !== undefined ? Number(q.correct) : Number(q.correct_choice) - 1,
          explanation: q.explanation ?? "",
          hint: q.hint,
        })),
      };

      if (spot.questions.length === 0) {
        alert("このスポットのクイズはまだ登録されていません。");
        return;
      }

      initializeSpot();
      showQuestion();
    } catch (error) {
      console.error(error);
      alert("データベースからクイズを読み込めませんでした。サーバーの接続を確認してください。");
    }
  }

  function setValues(view, values) {
    for (const field of view.querySelectorAll("[data-value]")) {
      const value = values[field.dataset.value];
      if (value !== undefined) field.textContent = value;
    }
  }

  function initializeSpot() {
    const portTower = spot.name === "神戸ポートタワー" || spot.id === "2";
    document.querySelector("[data-tower-stamp]")?.toggleAttribute("hidden", !portTower);
    const genericStamp = document.querySelector("[data-generic-stamp]");
    if (genericStamp) genericStamp.hidden = portTower;

    setValues(document, {
      "spot-name": spot.name,
      "spot-area": portTower ? "メリケンパーク" : "神戸市中央区",
      "spot-address": portTower ? "兵庫県神戸市中央区波止場町" : "兵庫県神戸市中央区",
      "spot-category": spot.category,
      "spot-description": spot.description,
      "badge-name": spot.badge,
    });
    for (const photo of document.querySelectorAll("[data-photo]")) {
      photo.hidden = !portTower;
      photo.nextElementSibling.hidden = portTower;
      if (portTower) {
        photo.addEventListener("error", () => {
          photo.hidden = true;
          photo.nextElementSibling.hidden = false;
        }, { once: true });
        photo.src = photo.dataset.photo;
      }
    }
  }

  function showView(name, focus = true) {
    activeView = name;
    startOver.disabled = name === "question";
    for (const [key, view] of Object.entries(views)) view.hidden = key !== name;
    heading.textContent = name === "summary" ? "クイズ結果" : "観光クイズ";
    if (focus) {
      window.scrollTo(0, 0);
      views[name].querySelector('[tabindex="-1"]')?.focus({ preventScroll: true });
    }
  }

  function updateProgress(view, answered) {
    const total = spot.questions.length;
    const current = questionIndex + 1;
    const percentage = Math.round(answered / total * 100);
    setValues(view, {
      "current-question": `第${current}問`,
      "total-questions": `/ 全${total}問`,
      "question-count": `第${current}問 / 全${total}問`,
      "percentage": `${percentage}%`,
      "achievement": `達成率 ${percentage}%`,
    });
    view.querySelector('[role="progressbar"]').setAttribute("aria-valuenow", String(percentage));
    view.querySelector("[data-progress-fill]").style.width = `${percentage}%`;
  }

  function showQuestion(focus = false) {
    const question = spot.questions[questionIndex];
    form.reset();
    submit.disabled = true;
    hint.setAttribute("aria-expanded", "false");
    hintContent.hidden = true;
    updateProgress(form, questionIndex);
    setValues(form, {
      question: question.text,
      "question-tag": `第${questionIndex + 1}問`,
      "selected-summary": "未選択",
      hint: question.hint ?? "問題文のキーワードを手がかりに、選択肢を見比べてみましょう。",
    });
    form.querySelectorAll('[data-value="choice"]').forEach((choice, index) => {
      choice.textContent = question.choices[index];
    });
    showView("question", focus);
  }

  hint.addEventListener("click", () => {
    hintContent.hidden = !hintContent.hidden;
    hint.setAttribute("aria-expanded", String(!hintContent.hidden));
  });

  form.addEventListener("change", event => {
    if (activeView !== "question" || event.target.name !== "answer" || !spot) return;
    const selected = Number(event.target.value);
    const answer = spot.questions[questionIndex].choices[selected];
    setValues(form, { "selected-summary": `選択中: ${letters[selected]} ${answer}` });
    submit.disabled = false;
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (activeView !== "question" || !spot) return;
    const value = new FormData(form).get("answer");
    if (value === null) return;

    const question = spot.questions[questionIndex];
    const selected = Number(value);
    const correct = selected === question.correct;
    if (correct) correctCount += 1;
    const name = correct ? "correct" : "incorrect";
    const view = views[name];
    const total = spot.questions.length;
    updateProgress(view, questionIndex + 1);
    setValues(view, {
      question: question.text,
      "selected-letter": letters[selected],
      "selected-answer": question.choices[selected],
      "correct-letter": letters[question.correct],
      "correct-answer": question.choices[question.correct],
      explanation: question.explanation,
      "advance-label": questionIndex + 1 < total ? `次の問題へ (${questionIndex + 2}/${total})` : "結果を見る",
    });
    showView(name);
  });

  for (const button of document.querySelectorAll('[data-action="advance"]')) {
    button.addEventListener("click", () => {
      if (activeView !== "correct" && activeView !== "incorrect") return;
      questionIndex += 1;
      if (questionIndex < spot.questions.length) showQuestion(true);
      else showSummary();
    });
  }

  function showSummary() {
    const view = views.summary;
    const total = spot.questions.length;
    const accuracy = Math.round(correctCount / total * 100);
    const cleared = correctCount === total;
    view.removeAttribute("data-stamp-claimed");
    claim.hidden = !cleared;
    claim.disabled = false;
    setValues(view, {
      "completion-text": `${spot.name}のクイズにすべて回答しました。`,
      score: correctCount,
      "score-total": `/ ${total} 問正解！`,
      accuracy: `正解率 ${accuracy}%`,
      "score-summary": `${correctCount} / ${total} 問正解`,
      "percentage-score": `${accuracy}%`,
      "stamp-status": cleared ? "未獲得（受取可能）" : "未獲得",
      "stamp-info": cleared
        ? "スタンプの受け取りを試せます。"
        : "全問正解すると、スタンプを受け取れます。",
    });
    claim.querySelector("#btn-label-text").textContent = "スタンプを受け取る";
    view.querySelectorAll("[data-score-star]").forEach((star, index) => {
      star.classList.toggle("score-star-earned", index < Math.round(accuracy / 20));
    });
    showView("summary");
  }

  claim?.addEventListener("click", () => {
    if (activeView !== "summary" || claim.disabled || claim.hidden) return;
    views.summary.setAttribute("data-stamp-claimed", "");
    setValues(views.summary, {
      "stamp-status": "獲得済み（サンプル）",
      "stamp-info": "この画面でスタンプの受け取りを確認できます。",
    });
    claim.querySelector("#btn-label-text").textContent = "受け取り済み";
    claim.disabled = true;
    retry?.focus({ preventScroll: true });
  });

  function restartQuiz() {
    if (!spot) return;
    questionIndex = 0;
    correctCount = 0;
    showQuestion(true);
  }

  retry?.addEventListener("click", restartQuiz);
  startOver?.addEventListener("click", restartQuiz);
})();