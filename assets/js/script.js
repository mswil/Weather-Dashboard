
const getCityURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const getWeatherURL = "https://api.openweathermap.org/data/2.5/onecall?";

const apiTemperatureUnitF = "&units=imperial";
const apiKey = "&appid=0e6224d44e597d1d9ed03b3b207fc815"

//get lat and lon from 1st api call weather?q=
//get atcual weater data from 2nd onecall?lat={}&lon={}

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
                    showWeather(data, cityData.name);
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

const showWeather = function (cityData, city) {
    showTodaysForcast(cityData, city);
    show5DayForcast(cityData);

}

const showTodaysForcast = function (cityData, city) {
    $("#todays-forcast").empty();

    const template = $($("#todays-forcast-template").html());

    template.find("#city").text(city);
    template.find("#date").text(moment().format("l"));
    template.find("#weather-icon").attr("src", "http://openweathermap.org/img/wn/" + cityData.current.weather[0].icon + ".png");

    template.find("#today-tempurature").text(cityData.current.temp);
    template.find("#today-wind").text(cityData.current.wind_speed);
    template.find("#today-humidity").text(cityData.current.humidity);
    template.find("#today-uv-index").text(cityData.current.uvi);

    $("#todays-forcast").append(template);

};

const show5DayForcast = function (cityData) {

};

$("#search-btn").on("click", function (event) {
    // event.preventDefault();

    const city = $("#city-search").val();
    getLatAndLon(city);

    //TODO: add city to search history

});
