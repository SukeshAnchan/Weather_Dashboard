

PopulateSearchHistory();

$('#searchButton').click(function() {
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
}

function GetSearchHistory() {

}
function PopulateSearchHistory() {

}



