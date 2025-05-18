document.getElementById("get-recommendation").addEventListener("click", () => {
  const category = document.getElementById("category").value;

  // 사용자 위치 가져오기
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // 날씨 API 호출 (예시: OpenWeather)
        const apiKey = "70c0fc31be9ddb52bc508a97e4325bf5";
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

        try {
          const response = await fetch(weatherURL);
          const data = await response.json();
          const weather = data.weather[0].description;

          document.getElementById("recommendation-result").innerText =
            `현재 위치(${lat.toFixed(2)}, ${lon.toFixed(2)})의 날씨는 "${weather}"입니다.\n` +
            `선택한 카테고리 "${category}"에 맞는 여행지를 추천합니다! (추천 알고리즘 개발 예정)`;
        } catch (error) {
          document.getElementById("recommendation-result").innerText =
            "날씨 정보를 가져오는 데 실패했습니다.";
        }
      },
      () => {
        document.getElementById("recommendation-result").innerText =
          "위치 정보를 사용할 수 없습니다.";
      }
    );
  } else {
    document.getElementById("recommendation-result").innerText =
      "이 브라우저는 위치 정보를 지원하지 않습니다.";
  }
});
