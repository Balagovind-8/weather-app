const apiKey = "812c048e7e364cdcbe6a77a2bf929a41"; // replace with your actual API key
const weatherContainer = document.getElementById("weather-container");
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeatherData(city);
  }
});

async function getWeatherData(city) {
  try {
    // Fetch city coordinates from OpenWeather Geocoding API
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoResponse.json();

    // ✅ Check if data exists
    if (!geoData || geoData.length === 0) {
      weatherContainer.innerHTML = `<p class="error">❌ City not found. Please try another.</p>`;
      return;
    }

    const { lat, lon } = geoData[0];

    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    const weatherData = await weatherResponse.json();

    displayWeather(weatherData);
  } catch (error) {
    console.error(error);
    weatherContainer.innerHTML = `<p class="error">⚠️ Something went wrong. Try again later.</p>`;
  }
}

function displayWeather(data) {
  const {
    name,
    main: { temp, humidity },
    weather,
    wind: { speed },
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
