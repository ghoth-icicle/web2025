document.getElementById("get-recommendation").addEventListener("click", () => {
  const category = document.getElementById("category").value;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const apiKey = "70c0fc31be9ddb52bc508a97e4325bf5";
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=${apiKey}&units=metric&lang=kr`;

        try {
          const response = await fetch(weatherURL);
          const data = await response.json();
          const weatherMain = data.weather[0].main.toLowerCase();
          const isRainy = weatherMain.includes("rain");

          const placesResponse = await fetch("tryagain.json");
          const places = await placesResponse.json();

          // 거리 계산 함수 (Haversine 공식)
          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = deg => deg * (Math.PI / 180);
            const R = 6371; // 지구 반지름 (km)
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a = Math.sin(dLat / 2) ** 2 +
                      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                      Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          // 조건에 맞는 여행지 필터링 + 거리 계산
          const filtered = places
            .filter(place =>
              place.category === category &&
              (isRainy ? place.indoor : true)
            )
            .map(place => ({
              ...place,
              distance: calculateDistance(userLat, userLon, place.lat, place.lon)
            }))
            .sort((a, b) => a.distance - b.distance); // 거리순 정렬

          if (filtered.length > 0) {
            const nearestPlace = filtered[0]; // 가장 가까운 여행지 추천
            document.getElementById("recommendation-result").innerText =
              `📍 현재 날씨: ${data.weather[0].description}\n` +
              `✅ 가까운 추천 여행지: ${nearestPlace.name} (약 ${nearestPlace.distance.toFixed(1)}km 거리)`;
          } else {
            document.getElementById("recommendation-result").innerText =
              `😢 조건에 맞는 여행지를 찾지 못했습니다.\n다른 카테고리를 선택해보세요.`;
          }
        } catch (error) {
          console.error(error);
          document.getElementById("recommendation-result").innerText =
            "❌ 데이터 처리 중 오류가 발생했습니다.";
        }
      },
      () => {
        document.getElementById("recommendation-result").innerText =
          "❌ 위치 정보를 사용할 수 없습니다.";
      }
    );
  } else {
    document.getElementById("recommendation-result").innerText =
      "❌ 이 브라우저는 위치 정보를 지원하지 않습니다.";
  }
});
