// my specific api key for open weather
let APIkey = "411dcdd1b9e3fd9cad9ddeec3999a631";

// variables to be filled with user input to then be used in the API call
let city;
let state;
let country;
let units = "imperial";

let searchHistoryArr = [];

// declaring query url to be able to manipulate it within functions
let queryURL;

// event listener on the placeholder fetch button to query the api
$(".getBtn").click(function () {
  city = $(".cityInput").val();
  state = $(".stateInput").val();
  fetchWeather(city, state);
  addToSearchHistory(city, state);
});

// pulls the city that the user input, then constructs the query url
// uses fetch to sent the api request. utilizes an if statement to confirm the request was returned successfully.
// if a successful response is receieved, it it parsed out by json into useable data
// function then feeds the data into the displaycurrentweather and display5day functions
function fetchWeather(city, state) {
  queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "," +
    state +
    "&appid=" +
    APIkey +
    "&units=" +
    units;

  $(".cityInput").val("");
  $(".stateInput").val("Select State...");

  fetch(queryURL)
    .then(function (res) {
      if (!res.ok) {
        console.log(res.statusText);
        alert(
          "There was a problem processing your request. Please check the spelling of your city name and try again."
        );
        location.reload();
        return;
      } else {
        return res.json();
      }
    })
    .then(function (data) {
      console.log(data);
      displayCurrentWeather(data);
      display5Day(data);
    })
    .catch(console.error);

  state = state.split("-")[1];
  $(".currentState").text(state.toUpperCase());
}

// this function renders the fetched weather data to the page
// it first captures the icon number, inserts it into the openweather icon url, and sets it as the source to the card image
// it then simply pulls data from the response object, rounds them to pretty whole numbers, and displays to the page
function displayCurrentWeather(data) {
  let icon = data.list[0].weather[0].icon;
  let imgSRC = "https://openweathermap.org/img/wn/" + icon + "@4x.png";
  $(".currentIMG").attr("src", imgSRC);

  $(".currentCity").text(data.city.name);
  $(".currentDate").text(dayjs(data.list[0].dt_txt).format("ddd, MMM D"));
  $(".currentTemp").text(Math.round(data.list[0].main.temp) + "°F");
  $(".currentFeel").text(Math.round(data.list[0].main.feels_like) + "°F");
  $(".currentHumidity").text(Math.round(data.list[0].main.humidity) + "%");
  $(".currentWind").text(Math.round(data.list[0].wind.speed) + "MPH");
  $(".current-card-title").text(data.list[0].weather[0].main);
}

// this works and pulls the next 5 days
function display5Day(data) {
  $(".forecastDisplay").empty();

  for (let i = 7; i <= 39; i += 8) {
    let cardHolder = $("<div>");
    let cardDesc = $("<div>");
    let forecastDate = $("<p>");
    let IMG = $("<img>");
    let cardBody = $("<div>");
    let cardTitle = $("<h5>");
    let temp = $("<p>");
    let humidity = $("<p>");
    let wind = $("<p>");

    forecastDate.text(dayjs(data.list[i].dt_txt).format("ddd, MMM D"));
    let forecastIMG = data.list[i].weather[0].icon;
    let forecastIMGSRC =
      "https://openweathermap.org/img/wn/" + forecastIMG + "@2x.png";
    IMG.attr("src", forecastIMGSRC);
    cardTitle.text(data.list[i].weather[0].main);
    temp.text("Temp: " + Math.round(data.list[i].main.temp) + "°F");
    humidity.text("Humidity: " + data.list[i].main.humidity + "%");
    wind.text("Wind Speed: " + Math.round(data.list[i].main.temp) + "MPH");

    cardHolder.addClass("cluster pt-3 shadow rounded custom-border");
    cardTitle.addClass("text-center");

    cardDesc.append(forecastDate);
    cardDesc.append(IMG);
    cardBody.append(cardTitle);
    cardBody.append(temp);
    cardBody.append(humidity);
    cardBody.append(wind);
    cardHolder.append(cardDesc);
    cardHolder.append(cardBody);

    $(".forecastDisplay").append(cardHolder);
  }
}

// Setting up search history array
function addToSearchHistory(city, state) {
  state = state.split("-")[1];
  // $(".currentState").text(state);
  searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
  if (searchHistoryArr === null || searchHistoryArr === undefined) {
    searchHistoryArr = [];
  }

  if (
    !searchHistoryArr.includes(city.toUpperCase() + ", " + state.toUpperCase())
  ) {
    searchHistoryArr.unshift(city.toUpperCase() + ", " + state.toUpperCase());
    console.log(searchHistoryArr);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
    renderSearchHistory();
  } else {
    return;
  }
}

function renderSearchHistory() {
  $(".searchHistoryContainer").empty();

  searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
  console.log(searchHistoryArr);
  if (searchHistoryArr === null || searchHistoryArr === undefined) {
    return;
  }

  if (searchHistoryArr.length < 5) {
    for (let i = 0; i < searchHistoryArr.length; i++) {
      let recentSearch = $("<button>");
      recentSearch.text(searchHistoryArr[i]);
      recentSearch.addClass("btn btn-secondary btn-sm");
      $(".searchHistoryContainer").append(recentSearch);
    }
  } else {
    for (let i = 0; i < 5; i++) {
      let recentSearch = $("<button>");
      recentSearch.text(searchHistoryArr[i]);
      recentSearch.addClass("btn btn-secondary btn-sm");
      $(".searchHistoryContainer").append(recentSearch);
    }
  }
}

$(".searchHistoryContainer").click(function (e) {
  city = $(e.target).text();
  fetchWeather(city);
});

$(".clearHistoryBtn").click(function () {
  localStorage.clear();
  location.reload();
});

// renders any search history on load
renderSearchHistory();

// calls fetchWeather to display results for tampa on load
fetchWeather("tampa", "us-fl");
