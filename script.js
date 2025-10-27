const apiKey = "1ec1a8428fecd108f63c14503def4e42"; // your API key
const weatherContainer = document.getElementById("weather-container");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeatherData(city);
  } else {
    weatherContainer.innerHTML = `<p class="error">⚠️ Please enter a city name.</p>`;
  }
});

async function getWeatherData(city) {
  try {
    console.log("Searching for:", city);

    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();
    console.log("Geo data:", geoData);

    if (!geoData || geoData.length === 0) {
      weatherContainer.innerHTML = `<p class="error">❌ City not found. Try another.</p>`;
      return;
    }

    const { lat, lon } = geoData[0];

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const weatherData = await weatherResponse.json();
    console.log("Weather data:", weatherData);

    if (!weatherResponse.ok || !weatherData.main) {
      weatherContainer.innerHTML = `<p class="error">⚠️ Unable to fetch weather. Try again.</p>`;
      return;
    }

    displayWeather(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    weatherContainer.innerHTML = `<p class="error">⚠️ Something went wrong. Check the console.</p>`;
  }
}


function displayWeather(data) {
  if (!data || !data.main || !data.weather) {
    weatherContainer.innerHTML = `<p class="error">⚠️ Weather data unavailable. Try another city.</p>`;
    return;
  }

  const {
    name = "Unknown",
    main: { temp = "N/A", humidity = "N/A" },
    weather = [{ description: "N/A", icon: "01d" }],
    wind: { speed = "N/A" } = {},
  } = data;

  weatherContainer.innerHTML = `
    <div class="weather-card">
      <h2>${name}</h2>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
      <p class="temp">${temp}°C</p>
      <p class="desc">${weather[0].description}</p>
      <p>💨 Wind: ${speed} m/s</p>
      <p>💧 Humidity: ${humidity}%</p>
    </div>
  `;
}
