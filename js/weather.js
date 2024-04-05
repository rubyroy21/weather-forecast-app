const apiKey = "28d914b9023ded512cf0048bdce6cc5c";
window.addEventListener("load", () => {
  // Parse query parameters to get the city and country
  const params = new URLSearchParams(window.location.search);
  const city = params.get("city");
  const country = params.get("country");

  // Fetch weather data for the specified city
  fetchWeatherData(city, country);
});

// Event listener for the "Current Location" button
document.getElementById("currentLocationFun").addEventListener("click", () => {
  getCurrentLocationWeather();
});

function fetchWeatherData(city, country) {
  const url =
    `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&` +
    `appid=${apiKey}`;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      // Display weather data on the forecast.html page
      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;

      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";

      document.getElementById("clouds").innerText = data.weather[0].description;

      let icon1 = data.weather[0].icon;
      let iconUrl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
      document.getElementById("img").src = iconUrl;
    });
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let lon = position.coords.longitude;
      let lat = position.coords.latitude;
      const url =
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
        `lon=${lon}&appid=${apiKey}`;

      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          weatherReport(data);
        });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function searchByCity() {
  var place = document.getElementById("input").value;
  var urlSearch =
    `http://api.openweathermap.org/data/2.5/weather?q=${place}&` +
    `appid=${apiKey}`;

  fetch(urlSearch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      // Pass the data to the URL of forecast.html using query parameters
      window.location.href = `/forecast.html?city=${data.name}&country=${data.sys.country}`;
    });
  document.getElementById("input").value = "";
}

function weatherReport(data) {
  var urlCast =
    `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` +
    `appid=${apiKey}`;

  fetch(urlCast)
    .then((res) => {
      return res.json();
    })
    .then((forecast) => {
      console.log(forecast.city);
      hourForecast(forecast);
      dayForecast(forecast);

      console.log(data);
      document.getElementById("city").innerText =
        data.name + ", " + data.sys.country;
      console.log(data.name, data.sys.country);

      console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temperature").innerText =
        Math.floor(data.main.temp - 273) + " °C";

      document.getElementById("clouds").innerText = data.weather[0].description;
      console.log(data.weather[0].description);

      let icon1 = data.weather[0].icon;
      let iconUrl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
      document.getElementById("img").src = iconUrl;
    });
}

function hourForecast(forecast) {
  document.querySelector(".templist").innerHTML = "";
  for (let i = 0; i < 5; i++) {
    var date = new Date(forecast.list[i].dt * 1000);
    console.log(
      date.toLocaleTimeString(undefined, "Asia/Kolkata").replace(":00", "")
    );

    let hourR = document.createElement("div");
    hourR.setAttribute("class", "next");

    let div = document.createElement("div");
    let time = document.createElement("p");
    time.setAttribute("class", "time");
    time.innerText = date
      .toLocaleTimeString(undefined, "Asia/Kolkata")
      .replace(":00", "");

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";

    div.appendChild(time);
    div.appendChild(temp);

    let desc = document.createElement("p");
    desc.setAttribute("class", "desc");
    desc.innerText = forecast.list[i].weather[0].description;

    hourR.appendChild(div);
    hourR.appendChild(desc);
    document.querySelector(".templist").appendChild(hourR);
  }
}

function dayForecast(forecast) {
  document.querySelector(".weekF").innerHTML = "";
  // Start the loop from index 0 to include the first day
  for (let i = 0; i < forecast.list.length; i += 8) {
    console.log(forecast.list[i]);
    let div = document.createElement("div");
    div.setAttribute("class", "dayF");

    let day = document.createElement("p");
    day.setAttribute("class", "date");
    day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(
      undefined,
      "Asia/Kolkata"
    );
    div.appendChild(day);

    let temp = document.createElement("p");
    temp.innerText =
      Math.floor(forecast.list[i].main.temp_max - 273) +
      " °C" +
      " / " +
      Math.floor(forecast.list[i].main.temp_min - 273) +
      " °C";
    div.appendChild(temp);

    let description = document.createElement("p");
    description.setAttribute("class", "desc");
    description.innerText = forecast.list[i].weather[0].description;
    div.appendChild(description);

    document.querySelector(".weekF").appendChild(div);
  }
}
