document.getElementById("get-recommendation").addEventListener("click", () => {
  const category = document.getElementById("category").value;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // ✅ 최신 API 키 사용
        const apiKey = "70c0fc31be9ddb52bc508a97e4325bf5";
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

        try {
          const response = await fetch(weatherURL);
          const data = await response.json();
          const weatherMain = data.weather[0].main.toLowerCase(); // 예: rain, clear 등

          const isRainy = weatherMain.includes("rain");

          // 여행지 데이터 로드
          const placesResponse = await fetch("tryagain.json");
          const places = await placesResponse.json();

          // 조건에 맞는 여행지 필터링
          const filtered = places.filter(place =>
            place.category === category &&
            (isRainy ? place.indoor : true)
          );

          if (filtered.length > 0) {
            const randomPlace = filtered[Math.floor(Math.random() * filtered.length)];
            document.getElementById("recommendation-result").innerText =
              `📍 현재 날씨: ${data.weather[0].description}\n` +
              `✅ 추천 여행지: ${randomPlace.name}`;
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
