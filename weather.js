// WEATHER DASHBOARD

// Declare my variables. Use query selector cuz I not using Id.

// targets the weather form in html
const weatherForm = document.querySelector(".weatherForm");
// targets input element
const cityInput = document.querySelector(".cityInput");
// targets the div element
const card = document.querySelector(".card");
// api key from open weather
const apiKey = "ce1fa0c5ea3c4c19dd18692121c1b2a9";

// Submit form
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value;

    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);

            // save weather data to local storage. using json stringinfy api.
            localStorage.setItem("weatherData", JSON.stringify(weatherData));
        }
        catch(error){
            console.log(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city");
    }
});

// fetch weather data from the api call
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    console.log(response);

    if(!response.ok){
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}

// create content for the div element. Use data destructuring.
function displayWeatherInfo(data){
    const {name: city, main: {temp, humidity}, weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

// get weather conditions based on the condition codes provided in open weather. then insert emoji accordingly.
function getWeatherEmoji(weatherId){
    switch(true){
        case(weatherId >= 200 && weatherId < 300):
            return "⛈️";

        case(weatherId >= 300 && weatherId < 400):
            return "🌧️";

        case(weatherId >= 500 && weatherId < 600):
            return "🌧️";
            
        case(weatherId >= 600 && weatherId < 700):
            return "❄️";

        case(weatherId >= 700 && weatherId < 800):
            return "🌫️";

        case(weatherId === 800):
            return "☀️";

        case(weatherId >= 801 && weatherId < 810):
            return "☁️";

        default:
            return "❓";
    }
}

// display error
function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}

// loads the saved data even after page is refreshed. needed json parse to read my data.
document.addEventListener("DOMContentLoaded", () => {
    const savedWeatherData = localStorage.getItem("weatherData");

    if (savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData);
        displayWeatherInfo(weatherData);
    }
});