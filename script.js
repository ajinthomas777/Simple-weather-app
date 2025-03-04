document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("button").addEventListener("click", getWeather);
});

const apiKey = '84d82727c66ceadf879f6dbe90002045';

function getWeather() {
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    Promise.all([
        fetch(currentWeatherUrl).then(res => res.json()),
        fetch(forecastUrl).then(res => res.json())
    ])
    .then(([currentData, forecastData]) => {
        if (currentData.cod !== 200) {
            throw new Error(currentData.message);
        }
        displayWeather(currentData);
        displayHourlyForecast(forecastData.list);
    })
    .catch(error => {
        alert(`Error: ${error.message}`);
        clearDisplay();
    });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    tempDivInfo.innerHTML = `<p>${temperature}°C</p>`;
    weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = '';

    const next8Hours = hourlyData.slice(0, 8).map(item => {
        const hour = new Date(item.dt * 1000).getHours();
        return `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                <span>${Math.round(item.main.temp)}°C</span>
            </div>
        `;
    }).join('');

    hourlyForecastDiv.innerHTML = next8Hours;
}

function clearDisplay() {
    document.getElementById('temp-div').innerHTML = '';
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('weather-icon').style.display = 'none';
    document.getElementById('hourly-forecast').innerHTML = '';
}
