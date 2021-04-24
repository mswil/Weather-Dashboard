
const getCityURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const getWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?";

const apiTemperatureUnitF = "&units=imperial";
const apiKey = "&appid=0e6224d44e597d1d9ed03b3b207fc815"

const getLatAndLon = function (city) {
    fetch(getCityURL + city + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    getWeather(data);
                })
            }
            else {
                console.log("Success: " + status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

};

const getWeather = function (cityData) {
    fetch(getWeatherURL
        + "lat=" + cityData.coord.lat + "&lon=" + cityData.coord.lon
        + apiTemperatureUnitF + "&exclude=hourly,minutely" + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    showForecast(data, cityData.name);
                })
            }
            else {
                console.log("Success: " + status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

};

const showForecast = function (cityData, city) {
    showTodaysForecast(cityData.current, city);
    for (let i = 1; i <= 5; i++) {
        showFutureForecast(cityData.daily[i]);
    }

}

const showTodaysForecast = function (currentData, city) {
    $("#todays-forecast").empty();

    const template = $($("#todays-forecast-template").html());

    template.find("#city").text(city);
    template.find("#date").text(calculateDate(currentData.dt));
    template.find(".weather-icon").attr("src", "http://openweathermap.org/img/wn/" + currentData.weather[0].icon + ".png");

    template.find(".tempurature").text(currentData.temp);
    template.find(".wind").text(currentData.wind_speed);
    template.find(".humidity").text(currentData.humidity);

    template.find(".uv-index").text(currentData.uvi);

    if(currentData.uvi < 3) {
        template.find(".uv-index").addClass("badge-success");
    }
    else if(currentData.uvi >=3 && currentData.uvi < 6) {
        template.find(".uv-index").addClass("badge-warning");
    }
    else {
        template.find(".uv-index").addClass("badge-danger");
    }

    $("#todays-forecast").append(template);

};

const showFutureForecast = function (futureData) {
    $("#weekly-forecast").empty();

    const template = $($("#weekly-forecast-template").html());

    template.find(".date").text(calculateDate(futureData.dt));
    template.find(".weather-icon").attr("src", "http://openweathermap.org/img/wn/" + futureData.weather[0].icon + ".png");
    template.find(".tempurature").text(futureData.temp.day);
    template.find(".wind").text(futureData.wind_speed);
    template.find(".humidity").text(futureData.humidity);

    $("#weekly-forecast").append(template);

};

const calculateDate = function (dt) {
    const date = new Date(dt * 1000);
    strDate = date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear();
    return strDate;
}

getLatAndLon("prosper");

$("#search-btn").on("click", function (event) {
    // event.preventDefault();

    const city = $("#city-search").val();
    getLatAndLon(city);

    //TODO: add city to search history

});

