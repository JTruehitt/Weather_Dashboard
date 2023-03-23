// my specific api key for open weather
let APIkey = "411dcdd1b9e3fd9cad9ddeec3999a631";

// variables to be filled with user input to then be used in the API call
let city;
let state;
let units = "imperial";

let searchHistoryArr = [];

let primaryLocation;
// declaring query url to be able to manipulate it within functions
let queryURL;

// event listener on search button to query the api
// grabs the city and state values here to avoid issues when calling inital function on load
// ensures both city and state were put in, or else user gets an error message
// pushes the city and state to the fetch weather and search history functions
$(".getBtn").click(function (e) {
  e.preventDefault();
  city = $(".cityInput").val();
  state = $(".stateInput").val();

  if (city === "" || state === "Select State...") {
    alert(
      "There was a problem processing your request. Please check the spelling of your city name and be sure to select a state for accuracy."
    );
    location.reload();
  } else {
    fetchWeather(city, state);
    addToSearchHistory(city, state);
  }
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
// added additional functionality to change the page background dynamically depending on the current days conditions
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

  $("html").removeClass();

  if (data.list[0].weather[0].main == "Clear") {
    $("html").addClass("bg-clear");
  } else if (data.list[0].weather[0].main == "Clouds") {
    $("html").addClass("bg-clouds");
  } else if (data.list[0].weather[0].main == "Snow") {
    $("html").addClass("bg-snow");
  } else if (data.list[0].weather[0].main == "Thunderstorm") {
    $("html").addClass("bg-thunderstorm");
  } else if (
    data.list[0].weather[0].main == "Drizzle" ||
    data.list[0].weather[0].main == "Rain"
  ) {
    $("html").addClass("bg-rain");
  } else if (
    data.list[0].weather[0].main == "Mist" ||
    ata.list[0].weather[0].main == "Haze" ||
    ata.list[0].weather[0].main == "Fog"
  ) {
    $("html").addClass("bg-fog");
  } else {
    $("html").css("background-color", "gray");
  }
}

// this function captures the next 5 days outlook and by iterating over the returned data and creating elements to render to the page
//
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
    wind.text("Wind Spd: " + Math.round(data.list[i].main.temp) + "MPH");

    cardHolder.addClass("cluster py-3 shadow rounded custom-border");
    cardHolder.css("background-color", "rgba(200,200,200,.3)");
    cardTitle.addClass("text-center");
    forecastDate.addClass("text-center fw-bold");

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

// adds searched cities to a stored array
// pulls the state code from the select list and splits it on - to just populate the 2 letter state abbrev
// if no history is present in local storage, sets array to empty, else it pulls in the array, checks to see if current searched city is in there, and if not it will add it to the front to reflect is as the most recently searched
function addToSearchHistory(city, state) {
  state = state.split("-")[1];
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

// this function renders the most recently searched cities to the page
// if/else statement is set up to ensure a max of 5 cities are displayed at one time so as to not clutter the page with too many buttons
function renderSearchHistory() {
  $(".searchHistoryContainer").empty();

  searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
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

// this adds an event delegation to the search history container where the buttons are rendered
// pulls the city and state from the display on the button and feeds them back into the fetch weather function.
$(".searchHistoryContainer").click(function (e) {
  e.preventDefault();
  city = $(e.target).text();
  state = "US-" + city.split(", ")[1];
  city = city.split(",")[0];
  fetchWeather(city, state);
});

// clears all recent searched from local storage
$(".clearHistoryBtn").click(function () {
  localStorage.clear();
  location.reload();
});

// allows user to set the currently displayed location as primary, which will save the location to local storage and render that cities conditions on load
$(".makePrimaryBtn").click(function () {
  city = $(".currentCity").text();
  state = "US-" + $(".currentState").text();
  primaryLocation = city + "," + state;
  localStorage.setItem("primaryLocation", JSON.stringify(primaryLocation));

  $(".makePrimaryBtn").text("Saved Location!");

  setTimeout(function () {
    $(".makePrimaryBtn").text("Make Primary Location");
  }, 1500);
});

// function that actually pulls the saved location from local storage.
// if no primary location is saved, it will load the default of tampa, fl.
function callPrimaryLocationOnLoad() {
  primaryLocation = JSON.parse(localStorage.getItem("primaryLocation"));
  if (primaryLocation === null || primaryLocation === undefined) {
    city = "tampa";
    state = "us-fl";
  } else {
    city = primaryLocation.split(",")[0];
    state = primaryLocation.split(",")[1];
  }
  fetchWeather(city, state);
}

// renders any search history on load
renderSearchHistory();

// renders the user set primary location on load, or the default tampa fl
callPrimaryLocationOnLoad();
