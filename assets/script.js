// my specific api key for open weather
let APIkey = "411dcdd1b9e3fd9cad9ddeec3999a631";

// variables to be filled with user input to then be used in the API call
let city;
let state;
let country;
let units = "imperial";

// declaring query url to be able to manipulate it within functions
let queryURL;

// event listener on the placeholder fetch button to query the api
$(".getBtn").click(function () {
  fetchWeather();
});

// pulls the city that the user input, then constructs the query url
// uses fetch to sent the api request. utilizes an if statement to confirm the request was returned successfully.
// if a successful response is receieved, it it parsed out by json into useable data
// function then feeds the data into the displaycurrentweather and display5day functions
function fetchWeather() {
  city = $(".cityInput").val();
  queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    APIkey +
    "&units=" +
    units;

  fetch(queryURL)
    .then(function (res) {
      if (!res.ok) {
        console.log(res.statusText);
        return; //! put some kind of message here
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
}

// this function renders the fetched weather data to the page
// it first captures the icon number, inserts it into the openweather icon url, and sets it as the source to the card image
// it then simply pulls data from the response object, rounds them to pretty whole numbers, and displays to the page
function displayCurrentWeather(data) {
  let icon = data.list[0].weather[0].icon;
  let imgSRC = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
  $(".currentIMG").attr("src", imgSRC);
  console.log(imgSRC);

  $(".currentLocation").text(data.city.name);
  //   $(".currentTime").text(dayjs.unix(data.dt).format("h:mm a"));
  $(".currentTemp").text(Math.round(data.list[0].main.temp) + "°F");
  $(".currentFeel").text(Math.round(data.list[0].main.feels_like) + "°F");
  // $(".currentHigh").text(Math.round(data.list[0].main.temp_max) + "°F");
  // $(".currentLow").text(Math.round(data.list[0].main.temp_min) + "°F");
  $(".currentHumidity").text(Math.round(data.list[0].main.humidity) + "%");
  $(".currentWind").text(Math.round(data.list[0].wind.speed) + "MPH");
  $(".current-card-title").text(data.list[0].weather[0].main);
  // $(".current-card-title").text(data.weather[0].main);
}

// this works and pulls the next 5 days
function display5Day(data) {
  for (let i = 7; i <= 39; i += 8) {
    console.log(data.list[i].dt_txt);
  }
}
