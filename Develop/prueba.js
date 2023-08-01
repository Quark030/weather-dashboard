// We are selecting elements from the DOM using their IDs or classes and assigning them to variables
var userFormEl = document.querySelector('#user-form');
var languageButtonsEl = document.querySelector('#cities-buttons');
var cityInputEl = document.querySelector('#city');
var weatherContainerEl = document.querySelector('#weather-container');
var forecastContainerEl = document.querySelector('#forecast-container'); // Container for 5-day forecast
var citySearchTerm = document.querySelector('#city-search-term');
var searchHistoryEl = document.querySelector('#search-history'); // Element to show search history
var storageCity = {};

// This function is responsible for displaying the weather information for a given city
function displayWeather(cityName) {
  // Here, we are using an API key to fetch the weather data for the provided city from an external weather API
  var apiKey = '7100354c65afc67bd02277960af38987'; // Replace with your actual API key
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  // Fetch the current weather data for the city
  fetch(currentWeatherUrl)
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => {
      // Update the weatherContainer with the current weather information for the city
      weatherContainerEl.innerHTML = `
        <h3>${data.name} (${new Date().toLocaleDateString()})</h3>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Weather: ${data.weather[0].description}</p>
      `;

      // Show the city name in the citySearchTerm element
      citySearchTerm.textContent = cityName;
      citySearchTerm.parentElement.classList.remove('hidden');

      // Add the city to the search history
      addToSearchHistory(cityName);
    })
    .then(() => {
      // Fetch the 5-day forecast data for the city
      return fetch(forecastUrl);
    })
    .then(response => response.json()) // Convert the response to JSON format
    .then(data => {
      // Update the forecastContainer with the 5-day forecast information for the city

      // First, add a heading for the forecast
      forecastContainerEl.innerHTML = `<h3>5-Day Forecast:</h3>`;

      // Loop through the first 5 entries of the forecast data (next 5 days)
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

        // Set the inner HTML of the forecastItem with the forecast data
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
      // If there is an error during the fetch requests, log the error to the console
      console.log(error);
    });
}

// This function adds a city to the search history if it's not already there
function addToSearchHistory(cityName) {
  if (!storageCity[cityName]) {
    storageCity[cityName] = true;
    // Create a new button element for the city
    var cityButtonEl = document.createElement('button');
    cityButtonEl.textContent = cityName;
    cityButtonEl.setAttribute('data-city', cityName);
    cityButtonEl.classList.add('btn');
    // Add the city button to the search history element
    searchHistoryEl.appendChild(cityButtonEl);
  }
}

// This function handles the form submission event
function handleFormSubmit(event) {
  event.preventDefault();
  // Get the city name from the input element
  var city = cityInputEl.value.trim();

  if (city) {
    // If a city name is entered, display the weather for that city
    displayWeather(city);
    cityInputEl.value = ''; // Clear the input field after searching
  } else {
    alert('Please enter a city name.');
  }
}

// This function handles the click event on city buttons in the search history
function handleCityButtonClick(event) {
  var cityButton = event.target.closest('button');
  if (cityButton) {
    // If a city button is clicked, display the weather for that city
    var cityName = cityButton.dataset.city;
    displayWeather(cityName);
  }
}

// Add event listeners for form submission and city button clicks
userFormEl.addEventListener('submit', handleFormSubmit);
languageButtonsEl.addEventListener('click', handleCityButtonClick);


