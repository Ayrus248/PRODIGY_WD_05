const apiKey = '277b95eec924e0b5c49fdf265f0ec5c9';

function getWeather() {
    const location = document.getElementById('location').value;
    if (location) {
        fetchCurrentWeatherData(location);
        fetchForecastData(location);
    } else {
        alert('Please enter a location or use the current location button.');
    }
}

function getWeatherByCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchCurrentWeatherDataByCoords(lat, lon);
            fetchForecastDataByCoords(lat, lon);
        }, error => {
            console.error('Error fetching location:', error);
            alert('Unable to fetch location. Please try again.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

function fetchCurrentWeatherData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayCurrentWeather(data))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayError('Unable to fetch current weather data. Please try again.', 'weather-info');
        });
}

function fetchForecastData(location) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            displayError('Unable to fetch forecast data. Please try again.', 'forecast-info');
        });
}

function fetchCurrentWeatherDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayCurrentWeather(data))
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayError('Unable to fetch current weather data. Please try again.', 'weather-info');
        });
}

function fetchForecastDataByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            displayError('Unable to fetch forecast data. Please try again.', 'forecast-info');
        });
}

function displayCurrentWeather(data) {
    const weatherInfoDiv = document.getElementById('weather-info');
    if (data && data.main && data.weather && data.weather.length > 0) {
        const { name, main, weather } = data;
        const temperature = main.temp;
        const weatherDescription = weather[0].description;
        const weatherIcon = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;

        weatherInfoDiv.innerHTML = `
            <h3>${name}</h3>
            <p>Temperature: ${temperature} °C</p>
            <p>Weather: ${weatherDescription}</p>
            <img src="${weatherIcon}" alt="Weather icon">
        `;
    } else {
        displayError('Incomplete weather data received. Please try again.', 'weather-info');
    }
}

function displayForecast(data) {
    const forecastInfoDiv = document.getElementById('forecast-info');
    if (data && data.list && data.list.length > 0) {
        let forecastHTML = '';
        const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')); // Filter data to get one forecast per day (at noon)

        dailyData.slice(0, 5).forEach(item => {
            const date = new Date(item.dt_txt).toLocaleDateString();
            const temperature = item.main.temp;
            const weatherDescription = item.weather[0].description;
            const weatherIcon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

            forecastHTML += `
                <div class="forecast-day">
                    <h4>${date}</h4>
                    <img src="${weatherIcon}" alt="Weather icon">
                    <p>${weatherDescription}</p>
                    <p>${temperature} °C</p>
                </div>
            `;
        });

        forecastInfoDiv.innerHTML = forecastHTML;
    } else {
        displayError('Incomplete forecast data received. Please try again.', 'forecast-info');
    }
}

function displayError(message, elementId) {
    const infoDiv = document.getElementById(elementId);
    infoDiv.innerHTML = `<p class="error">${message}</p>`;
}
