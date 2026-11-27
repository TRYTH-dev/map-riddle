  // =====================================
    // 1. 地図を初期化（神戸周辺）
    // =====================================
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    const map = L.map("map", {
      zoomControl: false
    }).setView([34.7025, 135.1955], 15);

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
    // 2. PHP API設定 & 現在地（GPS）追跡
    // =====================================
    const API_URL = "api/spot.php";
    const markers = L.layerGroup().addTo(map);
    let requestNumber = 0;

    const status = document.getElementById("status");
    const keyword = document.getElementById("keyword");
    const searchButton = document.getElementById("search-button");

    let currentUserPos = null;
    let userMarker = null;
    let userRangeCircle = null;
    let firstGpsFix = true;

    function updateUserLocation(lat, lng) {
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

      if (firstGpsFix) {
        map.setView([lat, lng], 18);
        firstGpsFix = false;
        loadPlaces();
      }
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          updateUserLocation(pos.coords.latitude, pos.coords.longitude);
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
        q: keyword.value.trim() || "観光",
        bbox: bbox
      });

      if (currentUserPos) {
        params.append("user_lat", currentUserPos.lat);
        params.append("user_lng", currentUserPos.lng);
      }

      status.textContent = "施設を検索しています…";
      searchButton.disabled = true;

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

        status.textContent =
          spots.length > 0
            ? `${spots.length}件の施設を表示中`
            : "施設が見つかりません。キーワードを変えるか、地図を移動してください。";

      } catch (error) {
        if (thisRequest !== requestNumber) return;
        console.error(error);
        status.textContent =
          "施設を取得できませんでした。通信環境を確認してください。";
      } finally {
        if (thisRequest === requestNumber) {
          searchButton.disabled = false;
        }
      }
    }

    // =====================================
    // 4. 検索ボタン
    // =====================================
    document
      .getElementById("search-form")
      .addEventListener("submit", function (event) {
        event.preventDefault();
        loadPlaces();
      });

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