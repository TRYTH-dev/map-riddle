 let appData = null;
    let activeCategoryId = 'all';

    // 1. データ取得（今回はダミーデータを直接代入。実際は fetch('api.php') などにします）
    function loadData() {
      appData = {
        categories: [
          { id: 1, name: "ウォーターフロント" },
          { id: 2, name: "北野・三宮" },
          { id: 3, name: "六甲・有馬" },
          { id: 4, name: "灘・ベイエリア" }
        ],
        stamps: [
          { id: 1, categoryId: 1, name: "神戸ポートタワー", shortArea: "WF", icon: "🗼", date: "2024.08.10", isCollected: true, bg: "bg-red-50", border: "border-red-500/80" },
          { id: 2, categoryId: 2, name: "風見鶏の館", shortArea: "北野", icon: "🐓", date: "2024.08.12", isCollected: true, bg: "bg-amber-50", border: "border-amber-500/80" },
          { id: 3, categoryId: 2, name: "生田神社", shortArea: "三宮", icon: "⛩️", date: "2024.09.01", isCollected: true, bg: "bg-red-50", border: "border-red-500/80" },
          { id: 4, categoryId: 1, name: "南京町 中華街", shortArea: "元町", icon: "🐼", date: "2024.09.15", isCollected: true, bg: "bg-orange-50", border: "border-orange-500/80" },
          { id: 5, categoryId: 3, name: "六甲山 天覧台", shortArea: "六甲", isCollected: false },
          { id: 6, categoryId: 3, name: "有馬温泉 湯けむり", shortArea: "有馬", isCollected: false },
          { id: 7, categoryId: 1, name: "BE KOBE", shortArea: "WF", isCollected: false },
          { id: 8, categoryId: 4, name: "布引ハーブ園", shortArea: "布引", isCollected: false }
        ]
      };
      renderApp();
    }

    // 2. 画面全体の描画更新
    function renderApp() {
      renderSummary();
      renderFilters();
      renderStamps();
    }

    // 3. サマリー（一番上のカード）の更新
    function renderSummary() {
      const total = appData.stamps.length;
      const collected = appData.stamps.filter(s => s.isCollected).length;
      const percent = Math.round((collected / total) * 100);
      const remaining = total - collected;

      document.getElementById('summary-collected').innerText = collected;
      document.getElementById('summary-total').innerText = total;
      document.getElementById('summary-percent').innerText = `${percent}%`;
      document.getElementById('summary-progress-bar').style.width = `${percent}%`;
      
      document.getElementById('summary-remaining').innerText = remaining > 0 
        ? `神戸完全制覇まであと ${remaining} 箇所` 
        : `🎉 神戸完全制覇達成！`;
    }

    // 4. フィルタータブの生成
    function renderFilters() {
      const container = document.getElementById('filter-container');
      const activeClass = "px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shrink-0 shadow-xs";
      const inactiveClass = "px-3 py-1.5 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200 shrink-0 hover:bg-slate-50 transition";

      const allTotal = appData.stamps.length;
      let html = `<button onclick="changeFilter('all')" class="${activeCategoryId === 'all' ? activeClass : inactiveClass}">すべて (${allTotal})</button>`;

      appData.categories.forEach(cat => {
        const catStamps = appData.stamps.filter(s => s.categoryId === cat.id);
        const catCollected = catStamps.filter(s => s.isCollected).length;
        const isActive = activeCategoryId === cat.id;
        
        html += `<button onclick="changeFilter(${cat.id})" class="${isActive ? activeClass : inactiveClass}">
                  ${cat.name} (${catCollected}/${catStamps.length})
                 </button>`;
      });

      container.innerHTML = html;
    }

    // 5. スタンプの生成
    function renderStamps() {
      const container = document.getElementById('stamp-grid');
      let html = '';

      const displayStamps = activeCategoryId === 'all' 
        ? appData.stamps 
        : appData.stamps.filter(s => s.categoryId === activeCategoryId);

      displayStamps.forEach(stamp => {
        if (stamp.isCollected) {
          html += `
            <div class="bg-white rounded-xl p-2.5 flex flex-col items-center justify-between text-center shadow-sm border border-emerald-100/90 relative overflow-hidden group hover:shadow-md transition active:scale-95 animate-fade-in">
              <span class="absolute top-1.5 right-1.5 text-[10px] font-semibold px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50">${stamp.shortArea}</span>
              <div class="w-12 h-12 rounded-full ${stamp.bg} border-2 ${stamp.border} flex items-center justify-center shadow-inner relative mt-1">
                <span class="text-2xl select-none group-hover:scale-110 transition-transform">${stamp.icon}</span>
                <div class="absolute inset-0 rounded-full stamp-shine"></div>
              </div>
              <div class="mt-1.5 w-full">
                <span class="text-xs font-bold text-slate-800 block truncate">${stamp.name}</span>
                <span class="text-[10px] text-emerald-600 font-medium scale-90 block mt-0.5">${stamp.date}</span>
              </div>
            </div>`;
        } else {
          html += `
            <div class="bg-slate-100/70 border-2 border-dashed border-slate-300 rounded-xl p-2.5 flex flex-col items-center justify-between text-center min-h-[110px] relative animate-fade-in">
              <span class="absolute top-1.5 right-1.5 text-[10px] font-medium px-1 py-0.5 rounded bg-slate-200/60 text-slate-500">${stamp.shortArea}</span>
              <div class="w-11 h-11 rounded-full bg-slate-200/70 flex items-center justify-center text-slate-400 mt-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <rect height="10" rx="2" width="14" x="5" y="11"></rect><circle cx="12" cy="16" r="1.5"></circle><path d="M8 11V7a4 4 0 018 0v4"></path>
                </svg>
              </div>
              <div class="mt-1 w-full">
                <span class="text-xs font-medium text-slate-600 block truncate">${stamp.name}</span>
                <span class="text-[10px] text-slate-400 block mt-0.5">未獲得・接近で解放</span>
              </div>
            </div>`;
        }
      });

      container.innerHTML = html;
    }

    // 6. フィルター切り替え処理
    function changeFilter(categoryId) {
      activeCategoryId = categoryId;
      renderFilters();
      renderStamps();
    }

    // CSSアニメーション用のスタイル追加
    document.head.insertAdjacentHTML('beforeend', '<style>.animate-fade-in { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }</style>');
    // アプリ初期化
    loadData();