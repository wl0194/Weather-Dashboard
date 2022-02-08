var apiKey = "f61c25ccc3ebc66abfbc574449b8e000";
var cityName;
var searchCity = "";
var cityWeather = [];

$("#search-button").on("click", function (event) {
    event.preventDefault();
    searchCity = $("#search-city").val().trim();
    console.log(searchCity);
    cityWeather.push(searchCity);
    getWeatherByCity()
    renderCityBtn();

});

function getWeatherByCity() {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`;
    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function (response) {

        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var cityName = searchCity + "";
        var tempF = ((response.main.temp - 273.15) * 1.80 + 32).toFixed();
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var icon = response.weather[0].icon;
        var iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;

        $("#temperature").text(tempF + "°F");
        $("#humidity").text(humidity + "%");
        $("#windspeed").text(windSpeed + " MPH");
        $("#city").text(cityName + ",  ");
        var date = new Date().toLocaleString();
        $("#date").text(date + " ");
        $("#img").attr("src", iconUrl);

        var queryLat = lat;
        var queryLon = lon;

        // API call to get the UV values.
        var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${queryLat}&lon=${queryLon}`;
        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function (response2) {

            var uvValue = response2.value;
            $("#uv").text(uvValue);
            var i = uvValue;

            if (i < 3) {
                $("#uv").addClass("green");
            } else if (i < 6) {
                $("#uv").addClass("yellow");
            } else if (i < 8) {
                $("#uv").addClass("orange");
            } else if (i < 11) {
                $("#uv").addClass("red");
            } else {
                $("#uv").addClass("purple");
            }
        })

        //  This API call returns the data for the 5-Day forecast and populates the cards.
        var fiveDayUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${queryLat}&lon=${queryLon}&exclude=current,minutely,hourly&appid=${apiKey}`;
        $.ajax({
            url: fiveDayUrl,
            method: "GET"
        }).then(function (response3) {
            $(".five-day").each(function (index) {
                var Resdata = response3.daily[index + 1];
                var dateElem = Resdata.dt;
                var day = moment.unix(dateElem).format('l');
                var icon = Resdata.weather[0].icon;
                var iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
                var temp = ((Resdata.temp.day - 273.15) * 1.80 + 32).toFixed();
                var humidity = Resdata.humidity;

                $(this).find(".date").text(day);
                $(this).find(".weather-icon").attr("src", iconUrl);
                $(this).find(".temperature").text(temp + "°F");
                $(this).find(".humidity").text(humidity + "%");
            })

        });
    });
}

function renderCityBtn() {
    for (var i = 0; i < cityWeather.length; i++) {
        var cityBtn = $("<button>").text(cityWeather[i]);
        $(".button-storage").append(cityBtn);
    }
} 
