//Globals
const apiKey = "cf6388d2e2e3813bde3bc6a281df93aa"; //personal api access key for openweathermap
const weatherBox = $('#weatherBox');
const day1 = $('#day1');
const day2 = $('#day2');
const day3 = $('#day3');
const day4 = $('#day4');
const day5 = $('#day5');
var uvSpan = $('<span>');//had to put these outside the AddCurrentWeather function for asynchronous issues
uvSpan.attr("id", "uvSpan");//had to put these outside the AddCurrentWeather function for asynchronous issues

const weatherTypes = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Clear", "Clouds"]; //will be used to determine which image to show
const imageLinks = ["./assets/images/thunder.svg", "./assets/images/rainy-7.svg", "./assets/images/rainy-7.svg",
    "./assets/images/snowy-5.svg", "./assets/images/day.svg", "./assets/images/cloudy-day-1.svg"]; //array of weather image urls

PopulateSearchHistory();//on page load

//This function listens for the search button
$('#searchButton').click(function () {
    GetWeatherData($('#searchBox').val());
    AddSearchHistory($('#searchBox').val());
    PopulateSearchHistory();
});

//This function clears local storage
$('#clearButton').click(function () {
    localStorage.removeItem("history");
    PopulateSearchHistory();
});

//This allows the enter key to be used as well as clicking the search button
$(document).keypress(function (event) {
    if (event.which == 13) {
        $('#searchButton').click();
    }
})

//Search history button click event listener
$('#searchMenu').on('click', '.historyButton', function () {
    GetWeatherData($('#' + this.id).text());
})

//This function uses OpenWeather One Call API to get the weather data for a given city
function GetWeatherData(city) {
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(currentURL).then(function (response) {
        if (response.status === 404) {
            alert("City '" + city + "' not found! Please try a different city");
            weatherBox.text("");
            day1.text("");
            day2.text("");
            day3.text("");
            day4.text("");
            day5.text("");
            return;
        }
        return response.json();
    }).then(function (data) {
        AddCurrentWeather(data);
        AddFutureWeather(data);
    });
}

//This function adds the current weather to the weatherbox div
function AddCurrentWeather(data) {
    weatherBox.html("");
    var div1 = $('<div>');
    var div2 = $('<div>');
    var div3 = $('<div>');
    var div4 = $('<div>');
    var div5 = $('<div>');
    var col1 = $("<div>")
    var col2 = $("<div>");
    var col3 = $("<div>");
    var col4 = $("<div>");
    var col5 = $("<div>");
    var col6 = $("<div>");
    var h1 = $('<h1>');
    var img = $('<img>');
    var h31 = $('<h3>');
    var h32 = $('<h3>');
    var h33 = $('<h3>');
    var h34 = $('<h3>');

    div1.addClass("row my-2");
    div2.addClass("row my-2");
    div3.addClass("row my-2");
    div4.addClass("row my-2");
    div5.addClass("row my-2");
    col1.addClass("col");
    col2.addClass("col");
    col3.addClass("col");
    col4.addClass("col");
    col5.addClass("col");
    col6.addClass("col");

    var time = new Date(data.dt * 1000);
    h1.text(data.name + " (" + time.toLocaleString() + ")");
    img.attr("src", GetImageSrc(data.weather[0].main));
    h31.text("Temperature: " + data.main.temp + "\xB0" + "F");
    h32.text("Wind: " + data.wind.speed + " MPH");
    h33.text("Humidity: " + data.main.humidity + "%");
    h34.text("UV Index: ");
    var UVI = GetUVI(data);

    col1.append(h1);
    col2.append(img);
    col3.append(h31);
    col4.append(h32);
    col5.append(h33);
    h34.append(uvSpan);
    col6.append(h34);
    div1.append(col1);
    div1.append(col2);
    div2.append(col3);
    div3.append(col4);
    div4.append(col5);
    div5.append(col6);
    weatherBox.append(div1);
    weatherBox.append(div2);
    weatherBox.append(div3);
    weatherBox.append(div4);
    weatherBox.append(div5);
}

//This function fills the data for the 5 day forecast
function AddFutureWeather(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
     "&exclude=current,minutely,hourly,alert&appid=" + apiKey + "&units=imperial";
    fetch(requestURL).then(function (response) {
        if (response.status === 404) {
            alert("City not found!");
            return;
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        for (var i = 1; i < 6; i++) {
            $('#day' + i).text("");
            var row1 = $('<div>');
            var row2 = $('<div>');
            var img = $('<img>');
            var row3 = $('<div>');
            var row4 = $('<div>');
            var row5 = $('<div>');

            row1.addClass("row fiveDay m-2");
            row2.addClass("row fiveDay m-2");
            row3.addClass("row fiveDay m-2");
            row4.addClass("row fiveDay m-2");
            row5.addClass("row fiveDay m-2");

            var time = new Date(data.daily[i].dt * 1000);
            var date = time.toLocaleString().split(",");
            row1.text(date[0]);
            img.attr("src", GetImageSrc(data.daily[i].weather[0].main));
            row3.text("Temp: " + data.daily[i].temp.day + "\xB0" + "F");
            row4.text("Wind: " + data.daily[i].wind_speed + " MPG");
            row5.text("Humidity " + data.daily[i].humidity + "%");

            $('#day' + i).append(row1);
            row2.append(img);
            $('#day' + i).append(row2);
            $('#day' + i).append(row3);
            $('#day' + i).append(row4);
            $('#day' + i).append(row5);
        }
    });
}

//This function returns the url of an image depending on the weather type given
function GetImageSrc(weather) {
    for (var i = 0; i < weatherTypes.length; i++) {
        if (weatherTypes[i] === weather) {
            return imageLinks[i];
        }
    }
    //in case a weird weather type is given (tornado, hail) use cloudy as default
    //could maybe add support for abnormal weather later
    return imageLinks[5];
}

//This function gets the UV index for a given city
function GetUVI(data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    var requestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
    fetch(requestURL).then(function (response) {
        if (response.status === 404) {
            alert("UV index not found!");
            return -1;
        }
        return response.json();
    }).then(function (data) {
        var uvi = data.current.uvi
        uvSpan.text(uvi.toFixed(2));
        if (uvi < 2.01) {
            $('#uvSpan').css("background-color", "green");
        }
        else if (uvi < 5.01) {
            $('#uvSpan').css("background-color", "yellow");
        }
        else if (uvi < 7.01) {
            $('#uvSpan').css("background-color", "orange");

        }
        else if (uvi < 10.01) {
            $('#uvSpan').css("background-color", "red");

        }
        else {
            $('#uvSpan').css("background-color", "purple");

        }
    });
}

//This function adds a new item to the search history
function AddSearchHistory(city) {
    var history = GetSearchHistory();
    if (history === null) {
        localStorage.setItem("history", JSON.stringify(city));
    }
    else {
        var historySave = [].concat(history);
        historySave.push(city);
        localStorage.setItem("history", JSON.stringify(historySave));
    }
}

//This function gets the search history from local storage
function GetSearchHistory() {
    return JSON.parse(localStorage.getItem("history"));
}

//This function populates the search history
function PopulateSearchHistory() {
    var history = [].concat(GetSearchHistory());
    $('.historyButton').remove();
    if (history[0] === null) {
        return;
    }
    var searchMenu = $('#searchMenu');
    for (var i = history.length - 1; i >= 0; i--) {
        var button = $('<button>');
        button.addClass("btn");
        button.addClass("btn-secondary");
        button.addClass("btn-block");
        button.addClass("historyButton");
        button.attr("id", "button" + i);
        button.text(history[i]);
        searchMenu.append(button);
    }
}