

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

}



