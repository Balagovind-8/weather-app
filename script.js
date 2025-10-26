const API_KEY = "812c048e7e364cdcbe6a77a2bf929a41"; // 🔑 Replace with your OpenWeather API key

const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherInfo = document.getElementById("weather-info");
const errorMsg = document.getElementById("error");
const locationEl = document.getElementById("location");
const tempEl = document.getElementById("temperature");
const descEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const iconEl = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast-container");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  errorMsg.classList.add("hidden");
  weatherInfo.classList.add("hidden");
  errorMsg.textContent = "";

  try {
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const geoData = await geoRes.json();
    if (geoData.length === 0) throw new Error("City not found");

    const { lat, lon, name, country } = geoData[0];

    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
    );
    const weatherData = await weatherRes.json();

    displayWeather(name, country, weatherData);
  } catch (err) {
    errorMsg.textContent = err.message || "Error fetching weather data";
    errorMsg.classList.remove("hidden");
  }
});

function displayWeather(city, country, data) {
  const current = data.current;
  locationEl.textContent = `${city}, ${country}`;
  tempEl.textContent = `${Math.round(current.temp)}°C`;
  descEl.textContent = current.weather[0].description;
  humidityEl.textContent = current.humidity;
  windEl.textContent = current.wind_speed.toFixed(1);
  iconEl.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;

  forecastContainer.innerHTML = "";
  data.daily.slice(1, 6).forEach((day) => {
    const date = new Date(day.dt * 1000);
    const options = { weekday: "short", day: "numeric" };

    const div = document.createElement("div");
    div.classList.add("forecast-day");
    div.innerHTML = `
      <div>${date.toLocaleDateString(undefined, options)}</div>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
      <div>${Math.round(day.temp.max)}° / ${Math.round(day.temp.min)}°</div>
      <small>${day.weather[0].main}</small>
    `;
    forecastContainer.appendChild(div);
  });

  weatherInfo.classList.remove("hidden");
}
