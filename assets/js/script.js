

PopulateSearchHistory();

$('#searchButton').click(function () {
    var weatherData = GetWeatherData($('#searchBox').val());
    SetWeatherData(weatherData);
    //console.log(weatherData + " **\n" + $('#searchBox').val());
    AddSearchHistory($('#searchBox').val());
    PopulateSearchHistory();
});

function GetWeatherData(city) {
    return ["Tucson", "80.00F", "25mph", "50", ".5"];
}

function SetWeatherData(weatherData) {

}

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

function GetSearchHistory() {
    return JSON.parse(localStorage.getItem("history"));
}
function PopulateSearchHistory() {
    var history = [].concat(GetSearchHistory());
    if (history[0] === null) {
        return;
    }
    var searchMenu = $('#searchMenu');
    $('.searchButton').remove();
    for (var i = history.length-1; i >= 0; i--) {
        var button = $('<button>');
        button.addClass("btn");
        button.addClass("btn-secondary");
        button.addClass("btn-block");
        button.addClass("searchButton");
        button.text(history[i]);
        searchMenu.append(button);
    }
}



