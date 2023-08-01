var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#cities-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var forecastContainerEl = document.querySelector('#forecast-container'); // Container for 5-day forecast
var citySearchTerm = document.querySelector('#city-search-term');
var searchHistoryEl = document.querySelector('#search-history'); // Element to show search history
var storageCity = {};

function displayWeather(cityName) {
  var apiKey = '7100354c65afc67bd02277960af38987'; // Replace with your actual API key
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      weatherContainerEl.innerHTML = `
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Weather: ${data.weather[0].description}</p>
      `;

      citySearchTerm.textContent = cityName;
      citySearchTerm.parentElement.classList.remove('hidden');

     

      addToSearchHistory(cityName);
    })
    .then(() => {
      return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(data => {
      forecastContainerEl.innerHTML = `<h3>5-Day Forecast:</h3>`;

      for (var i = 0; i < 5; i++) {
        var forecastData = data.list[i];
        var forecastDate = new Date(forecastData.dt_txt).toLocaleDateString();
        var forecastIcon = forecastData.weather[0].icon;
        var forecastTemp = forecastData.main.temp;
        var forecastWindSpeed = forecastData.wind.speed;
        var forecastHumidity = forecastData.main.humidity;

        // Create a new div for each day's forecast
        var forecastItemEl = document.createElement('div');
        forecastItemEl.classList.add('forecast-item');

        forecastItemEl.innerHTML = `
          <h4>${forecastDate}</h4>
          <img src="https://openweathermap.org/img/wn/${forecastIcon}.png" alt="Weather Icon">
          <p>Temperature: ${forecastTemp}°C</p>
          <p>Wind Speed: ${forecastWindSpeed} m/s</p>
          <p>Humidity: ${forecastHumidity}%</p>
        `;

        // Append the forecast div to the forecastContainer
        forecastContainerEl.appendChild(forecastItemEl);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function addToSearchHistory(cityName) {
  if (!storageCity[cityName]) {
    storageCity[cityName] = true;
    var cityButtonEl = document.createElement('button');
    cityButtonEl.textContent = cityName;
    cityButtonEl.setAttribute('data-city', cityName);
    cityButtonEl.classList.add('btn');
    searchHistoryEl.appendChild(cityButtonEl);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();

  if (city) {
    displayWeather(city);
    cityInputEl.value = '';
  } else {
    alert('Please enter a city name.');
  }
}

function handleCityButtonClick(event) {
  var cityButton = event.target.closest('button');
  if (cityButton) {
    var cityName = cityButton.dataset.city;
    displayWeather(cityName);
  }
}

// Add event listeners
userFormEl.addEventListener('submit', handleFormSubmit);
languageButtonsEl.addEventListener('click', handleCityButtonClick);
