const apiKey = "cf6388d2e2e3813bde3bc6a281df93aa"; 
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
$(document).keypress(function(event) {
    if (event.which == 13) {
        $('#searchButton').click();
    }
})

//Search history button click event listener
$('#searchMenu').on('click', '.historyButton', function() {
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
        console.log(data);
        currentWeather = data;
    });
    fetch(dailyURL).then(function (response) {
        if (response.status === 404) {
            return;
        }
        return response.json();
    }).then(function (data) {
        console.log(data);
        dailyWeather = data;
    });
    SetWeatherData(currentWeather, dailyWeather);
}

//This function populates a cities weather data on the page
function SetWeatherData(currentWeather, dailyWeather) {
    
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
    for (var i = history.length-1; i >= 0; i--) {
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



