
//weather can search by city, but does not have uv-index info
const getCityURL = "https://api.openweathermap.org/data/2.5/weather?q=";
//onecall cannot search by city, but has uv-index info
const getWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?";

const apiParameters = "&units=imperial&exclude=hourly,minutely";
const apiKey = "&appid=0e6224d44e597d1d9ed03b3b207fc815"

const getLatAndLon = function (city) {
    fetch(getCityURL + city + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getWeather(data);
                    $("#city-search").val("");
                })
            }
            else {
                alert("Please enter a VALID city name");
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("Something went wrong. Please try again");
        });
};

const getWeather = function (cityData) {
    fetch(getWeatherURL + "lat=" + cityData.coord.lat + "&lon=" + cityData.coord.lon + apiParameters + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    showForecast(data, cityData.name);
                    saveCities(cityData.name);
                    showSearchHistory(loadCities());
                })
            }
            else {
                alert("Something went wrong. Please try a different city");
            }
        })
        .catch(function (error) {
            console.error(error);
            alert("Something went wrong. Please try again");
        });
};

const showForecast = function (cityData, city) {
    $("#todays-forecast").empty();
    $("#weekly-forecast").empty();

    $("#forecast").removeClass("d-none");
    showTodaysForecast(cityData.current, city);
    for (let i = 1; i <= 5; i++) {
        showFutureForecast(cityData.daily[i]);
    }
}

const showTodaysForecast = function (currentData, city) {

    const template = $($("#todays-forecast-template").html());

    template.find("#city").text(city);
    template.find("#date").text(formatDate(currentData.dt));
    template.find(".weather-icon").attr("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");

    template.find(".tempurature").text(currentData.temp);
    template.find(".wind").text(currentData.wind_speed);
    template.find(".humidity").text(currentData.humidity);

    template.find(".uv-index").text(currentData.uvi);

    if (currentData.uvi < 3) {
        template.find(".uv-index").addClass("badge-success");
    }
    else if (currentData.uvi >= 3 && currentData.uvi < 6) {
        template.find(".uv-index").addClass("badge-warning");
    }
    else {
        template.find(".uv-index").addClass("badge-danger");
    }

    $("#todays-forecast").append(template);
};

const showFutureForecast = function (futureData) {

    const template = $($("#weekly-forecast-template").html());

    template.find(".date").text(formatDate(futureData.dt));
    template.find(".weather-icon").attr("src", "http://openweathermap.org/img/wn/" + futureData.weather[0].icon + ".png");
    template.find(".tempurature").text(futureData.temp.day);
    template.find(".wind").text(futureData.wind_speed);
    template.find(".humidity").text(futureData.humidity);

    $("#weekly-forecast").append(template);
};

const formatDate = function (dt) {
    const date = new Date(dt * 1000);
    strDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
    return strDate;
}

const saveCities = function (city) {
    const savedCities = loadCities();

    if (!savedCities.includes(city)) {
        savedCities.push(city);
        localStorage.setItem("cities", JSON.stringify(savedCities))
    }
}

const loadCities = function () {
    let savedCities = localStorage.getItem("cities");
    if (!savedCities) {
        return [];
    }

    savedCities = JSON.parse(savedCities);
    return savedCities;
}

const showSearchHistory = function (cities) {
    $("#search-history").empty();

    for (let city of cities) {
        const template = $($("#search-history-template").html());

        template.find("button").text(city);
        template.find("button").on("click", function (event) {
            getLatAndLon(event.target.textContent);
        });

        $("#search-history").append(template);
    }
};

showSearchHistory(loadCities());

$("#search-form").on("submit", function (event) {
    event.preventDefault();

    const city = $("#city-search").val();
    if (!city) {
        alert("Please enter the name of a city");
    }
    else {
        getLatAndLon(city);
    }
});

