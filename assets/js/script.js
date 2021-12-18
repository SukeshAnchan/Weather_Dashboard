//Globals
const apiKey = "cf6388d2e2e3813bde3bc6a281df93aa"; //personal api access key for openweathermap
const weatherBox = $('#weatherBox');
const day1 = $('#day1');
const day2 = $('#day2');
const day3 = $('#day3');
const day4 = $('#day4');
const day5 = $('#day5');
const weatherTypes = ["Thunderstorm", "Drizzle", "Rain", "Snow", "Clear", "Clouds"]; //will be used to determine which image to show
const imageLinks = ["./assets/images/thunder.svg", "./assets/images/rainy-7.svg", "./assets/images/rainy-7.svg",
    "./assets/images/snowy-5.svg", "./assets/images/day.svg", "./assets/images/cloudy-day-1.svg"];






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
    var currentURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    var dailyURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";
    var currentWeather;
    var dailyWeather;
    fetch(currentURL).then(function (response) {
        if (response.status === 404) {
            alert("City not found!");
            return;
        }
        return response.json();
    }).then(function (data) {
        AddCurrentWeather(data);
    });
    fetch(dailyURL).then(function (response) {
        if (response.status === 404) {
            return;
        }
        return response.json();
    }).then(function (data) {
        AddFutureWeather(data);
    });
}

function AddCurrentWeather(data) {
    weatherBox.html("");
    var div = $('<div>');
    var col1 = $("<div>")
    var col2 = $("<div>");
    var h1 = $('<h1>');
    var img = $('<img>');
    div.addClass("row");
    col1.addClass("col");
    col2.addClass("col");
    var time = new Date(data.dt * 1000);
    h1.text(data.name + " (" + time.toLocaleString() + ")");
    img.attr("src", GetImageSrc(data.weather[0].main, data.dt));
    col1.append(h1);
    col2.append(img);
    div.append(col1);
    div.append(col2);
    weatherBox.append(div);
    //console.log(data);
}

function AddFutureWeather(data) {
   
}

function GetImageSrc(weather, time) {
    console.log(weather);
    console.log(time);
    for (var i = 0; i < weatherTypes.length; i++) {
        if (weatherTypes[i] === weather) {
            return imageLinks[i];
        }
    }
    
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



