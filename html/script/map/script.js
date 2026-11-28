 // =====================================
    // 1. 地図を初期化（神戸周辺）
    // =====================================
    const map = L.map("map", {
      zoomControl: false
    }).setView([34.7025, 135.1955], 15);

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    // OpenStreetMapの地図画像
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">' +
        'OpenStreetMap contributors</a>'
    }).addTo(map);

    // 拡大縮小ボタン
    L.control.zoom({
      position: "bottomright"
    }).addTo(map);
 // =====================================
    // 1-2. 神戸の観光地にピンを表示
    // =====================================
    const kobeSpots = [
      { id: "01",name: "神戸ポートタワー", lat: 34.6826, lng: 135.1867, url:"quiz.html"},
      { id: "02",name: "メリケンパーク", lat: 34.6815, lng: 135.1892, url:"quiz.html" },
      { id: "03",name: "神戸ハーバーランド umie", lat: 34.6786, lng: 135.1846, url:"quiz.html" },
      { id: "04",name: "南京町", lat: 34.6882, lng: 135.1890, url:"quiz.html"},
      { id: "05",name: "神戸旧居留地", lat: 34.6872, lng: 135.1920, url:"quiz.html" },
      { id: "06",name: "生田神社", lat: 34.6949, lng: 135.1907,url:"quiz.html"},
      { id: "07",name: "北野異人館街（風見鶏の館）", lat: 34.7014, lng: 135.1895, url:"quiz.html"},
      { id: "08",name: "神戸布引ハーブ園", lat: 34.71740, lng: 135.1912, url:"quiz.html" },
      { id: "09",name: "神戸どうぶつ王国", lat: 34.6545, lng: 135.2223, url:"quiz.html"},
      { id: "10",name: "摩耶山 掬星台", lat: 34.7339, lng: 135.2067, url:"quiz.html"},
      { id: "11",name: "六甲ガーデンテラス", lat: 34.7634, lng: 135.2464, url:"quiz.html" },
      { id: "12",name: "有馬温泉", lat: 34.7973, lng: 135.2478, url:"quiz.html" },
      { id: "13",name: "神戸須磨シーワールド", lat: 34.6439, lng: 135.1282, url:"quiz.html" },
      { id: "14",name: "王子動物園", lat: 34.71000, lng: 135.21444, url:"quiz.html" },
      { id: "15",name: "灘浜サイエンススクエア", lat: 34.701983, lng: 135.236542, url:"quiz.html" },
      { id: "16",name: "神戸海洋博物館", lat: 34.68278, lng: 135.18833, url:"quiz.html" },
      { id: "17",name: "萌黄の館", lat: 34.700908, lng: 135.189228, url:"quiz.html" },
      { id: "18",name: "ラインの館", lat: 34.701111, lng:  135.191183, url:"quiz.html" },
      { id: "19",name: "うろこの家・展望ギャラリー", lat: 34.702944, lng: 135.190635, url:"quiz.html" },
      { id: "20",name: "英国館", lat: 34.700727, lng: 135.191164, url:"quiz.html" },
      { id: "21",name: "ベンの家", lat: 34.700935, lng: 135.191532, url:"quiz.html" },
      { id: "22",name: "洋館長屋（仏蘭西館）", lat: 34.700850, lng: 135.191386, url:"quiz.html" },
      { id: "23",name: "山手八番館", lat: 34.703030, lng: 135.191023, url:"quiz.html" },
      { id: "24",name: "北野外国人倶楽部", lat: 34.68278, lng: 135.18833, url:"quiz.html" },
      { id: "25",name: "坂の上の異人館", lat: 34.703078, lng: 135.191351, url:"quiz.html" },
      { id: "26",name: "神戸トリックアート 不思議な領事館", lat: 34.700882, lng: 135.190862, url:"quiz.html" },
      { id: "27",name: "神戸北野美術館", lat: 34.701279, lng: 135.191461, url:"quiz.html" },
      { id: "28",name: "香りの家オランダ館", lat: 34.702143, lng: 135.190590, url:"quiz.html" },
      { id: "29",name: "デンマーク館", lat: 34.702298, lng: 135.190489, url:"quiz.html" },
      { id: "30",name: "ウィーン・オーストリアの家", lat: 34.702390, lng: 135.190761, url:"quiz.html" },
      { id: "31",name: "KOTO no HAKO KOBE", lat: 34.704376, lng: 135.195169, url:"quiz.html" },
    ];
   const kobeMarkers = L.layerGroup().addTo(map);
  kobeSpots.forEach((spot) => {
  const quizUrl = `quiz.html?spot_id=${encodeURIComponent(spot.id)}`;
  L.marker([spot.lat, spot.lng])
    .bindPopup(`<strong>${spot.name}</strong><br><a href="${quizUrl}">クイズへ進む</a>`)
    .addTo(kobeMarkers);
}); 
    // =====================================
    // 2. PHP API設定 & 現在地（GPS）追跡
    // =====================================
    const API_URL = "api/spots.php"; // ※実ファイル名に合わせて調整してください
    const markers = L.layerGroup().addTo(map);
    let requestNumber = 0;

    const locateButton = document.getElementById("locate-button");

    let currentUserPos = null;
    let userMarker = null;
    let userRangeCircle = null;
    let firstGpsFix = true;

    function updateUserLocation(lat, lng, centerMap = false) {
      currentUserPos = { lat, lng };

      if (!userMarker) {
        userMarker = L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: "#2563eb",
          color: "#ffffff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map).bindPopup("あなたの現在地");

        // 半径2mの判定エリア円
        userRangeCircle = L.circle([lat, lng], {
          radius: 2.0,
          color: "#2563eb",
          fillColor: "#3b82f6",
          fillOpacity: 0.2,
          weight: 1
        }).addTo(map);
      } else {
        userMarker.setLatLng([lat, lng]);
        userRangeCircle.setLatLng([lat, lng]);
      }

      if (firstGpsFix || centerMap) {
        map.setView([lat, lng], 18);
        firstGpsFix = false;
        loadPlaces();
      }
    }

    // 自動追尾（watchPosition）
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          updateUserLocation(pos.coords.latitude, pos.coords.longitude, false);
        },
        (err) => {
          console.warn("GPSエラー:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 10000
        }
      );
    }

    // =====================================
    // 現在地取得ボタンのクリック処理
    // =====================================
    locateButton.addEventListener("click", () => {
      if (!("geolocation" in navigator)) {
        return;
      }

      locateButton.disabled = true;

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          locateButton.disabled = false;
          // 現在地を更新し、地図を現在地中心に移動して再検索
          updateUserLocation(pos.coords.latitude, pos.coords.longitude, true);
        },
        (err) => {
          locateButton.disabled = false;
          console.warn("現在地取得エラー:", err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0, // ボタン押下時はキャッシュを使わず最新座標を取得
          timeout: 10000
        }
      );
    });

    // =====================================
    // 3. PHP APIから施設と2m範囲判定を取得
    // =====================================
    async function loadPlaces() {
      const thisRequest = ++requestNumber;
      const bounds = map.getBounds();

      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ].join(",");

      const params = new URLSearchParams({
        q: "観光",
        bbox: bbox
      });

      if (currentUserPos) {
        params.append("user_lat", currentUserPos.lat);
        params.append("user_lng", currentUserPos.lng);
      }

      try {
        const response = await fetch(`${API_URL}?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`APIエラー: ${response.status}`);
        }

        const data = await response.json();
        if (thisRequest !== requestNumber) return;

        markers.clearLayers();
        const spots = data.spots || [];

        for (const spot of spots) {
          const marker = L.marker([spot.latitude, spot.longitude]);

          const popupContent = document.createElement("div");
          popupContent.className = "tourism-popup";

          // 観光地名
          const title = document.createElement("div");
          title.className = "tourism-title";
          title.textContent = spot.name;
          popupContent.appendChild(title);

          // 距離ステータス表示
          const distBadge = document.createElement("div");
          distBadge.style.fontSize = "12px";
          distBadge.style.margin = "4px 0 8px";

          if (spot.distance_m === null) {
            distBadge.style.color = "#64748b";
            distBadge.textContent = "現在地を取得中...";
          } else if (spot.is_within_range) {
            distBadge.style.color = "#15803d";
            distBadge.style.fontWeight = "bold";
            distBadge.textContent = `圏内OK！（現在地から ${spot.distance_m}m）`;
          } else {
            distBadge.style.color = "#b91c1c";
            distBadge.textContent = `あと ${(spot.distance_m - spot.allowed_radius_m).toFixed(1)}m 近づこう（現在 ${spot.distance_m}m）`;
          }
          popupContent.appendChild(distBadge);

          // クイズへ進むボタン
          const quizButton = document.createElement("button");
          quizButton.className = "tourism-quiz-button";
          quizButton.style.width = "100%";
          quizButton.style.padding = "6px 10px";
          quizButton.style.borderRadius = "6px";
          quizButton.style.border = "none";
          quizButton.style.fontWeight = "bold";

          if (spot.is_within_range) {
            quizButton.style.background = "#2563eb";
            quizButton.style.color = "#ffffff";
            quizButton.style.cursor = "pointer";
            quizButton.textContent = "クイズへ進む";

            quizButton.addEventListener("click", () => {
              const qParams = new URLSearchParams({
                spot_id: spot.spot_id,
                name: spot.name,
                lat: currentUserPos.lat,
                lng: currentUserPos.lng
              });
              location.href = `quiz.html?${qParams.toString()}`;
            });
          } else {
            quizButton.style.background = "#cbd5e1";
            quizButton.style.color = "#64748b";
            quizButton.style.cursor = "not-allowed";
            quizButton.textContent = `半径${spot.allowed_radius_m}m以内で挑戦可能`;
            quizButton.disabled = true;
          }
          popupContent.appendChild(quizButton);

          marker.bindPopup(popupContent, {
            className: "tourism-popup-container",
            maxWidth: 400,
            closeButton: false,
            autoPan: true
          });

          marker.addTo(markers);
        }

      } catch (error) {
        if (thisRequest !== requestNumber) return;
        console.error(error);
      }
    }

    // =====================================
    // 5. 地図を移動したとき再検索
    // =====================================
    let moveTimer;
    map.on("moveend", function () {
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        loadPlaces();
      }, 350);
    });

    // =====================================
    // 6. 初回の施設取得
    // =====================================
    loadPlaces();