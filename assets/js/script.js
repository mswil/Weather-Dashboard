
const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const apiTemperatureUnitF = "&units=imperial";
const apiKey = "&appid=0e6224d44e597d1d9ed03b3b207fc815"



const getCityWeather = function (city) {
    fetch(apiURL + city + apiTemperatureUnitF + apiKey)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    return data;
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

getCityWeather("prosper");