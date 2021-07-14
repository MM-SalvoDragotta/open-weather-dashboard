const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
const searchList = document.querySelector("#search-list");

var forecastText = $("#forecast")

var theSearches = [];

const apiKey = "c5dae5a8e270024cd9fe6d4e536b2b74"

var today = moment(new Date()).format('ddd [, ] Do MMMM YYYY')

var forcastDays = []

for (var i=1; i<6; i++){
  futureDay = moment().add(i,'days').format('ddd [, ] Do MMMM YYYY')
  forcastDays.push(futureDay)
}
// console.log(forcastDays)
// var tomorrow  = moment().add(1,'days').format('ddd [, ] Do MMMM YYYY')

// $('.text').blur(function() {
// 	if ($(this).val() == '') {
//   	$('.err_text').empty().append('*');
//   } else {
//   	$('.err_text').empty();
//   }
// })

function renderSearches() {  
  // searchList.innerHTML = "";  
  // Render a new li for each searched city
  theSearches = theSearches.map(function(x){ return x.toUpperCase(); })
  theSearches.sort()
  //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
  var unique = theSearches.filter((v, i, a) => a.indexOf(v) === i);

  for (var i = 0; i < unique.length; i++) {
    $("#search-list")
    .append(`
    <li data-index=${i} class="saved-search">${theSearches[i]}
      <button class="save-city">❌</button>
    </li>
    `)
  }
}

function storeSearches() {
  // Stringify and set key in localStorage to theSearches array
  localStorage.setItem("Weather", JSON.stringify(theSearches));
}

function searchListRender(){
  var storedSearches = JSON.parse(localStorage.getItem("Weather"));
  // If theScores were retrieved from localStorage, update the theSearches array to it
  if (storedSearches !== null) {
    storedSearches = storedSearches.map(function(x){ return x.toUpperCase(); })
    storedSearches.sort()
    var unique = storedSearches.filter((v, i, a) => a.indexOf(v) === i);

    theSearches = unique;
    localStorage.setItem("Weather", JSON.stringify(unique));
  }
  // This is a helper function that will render Searches to the DOM
  renderSearches();
  searchLink ();


}

searchList.addEventListener("click", function(event) {
  var element = event.target;
  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the todo element from the list
    var index = element.parentElement.getAttribute("data-index");
    theSearches.splice(index, 1);
    $('#search-list').empty()
    // Store updated theScores in localStorage, re-render the list
    storeSearches();
    searchListRender();
  }
});

var fetchOneCall = function (lat, lon, name, country) {
    const oneCallEndpointUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${apiKey}`;
    fetch(oneCallEndpointUrl)
    .then(response => response.json())
    .then(data => {        
        const {current , daily } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${current.weather[0]["icon"]}.svg`; 
        // console.log(data)
        // console.log(current.temp);
        // console.log(current.wind_speed);
        // console.log(current.humidity);
        // console.log(current.uvi);
        // console.log(current.weather[0].icon);          
        $(".city")
        .append(`
        <div class="uvi" id="${current.uvi}"> UV index: ${current.uvi} </div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${current.weather[0]["description"]}">
          <figcaption>${current.weather[0]["description"]}</figcaption>
        </figure>
        `)  
        // console.log(daily[0].temp.day)
        // console.log(daily[0].wind_speed)
        // console.log(daily[0].humidity)
        // console.log(daily[0].uvi)
         
        for (i=0; i<5; i++){
          forecastText.show()
          forecastText.css({'padding':'50px','padding-left':'10px'} )
          const icon2 = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${daily[i].weather[0]["icon"]}.svg`;
        $(".forecasts")
          .append(`
            <li class="forecast">
              <h3 class="date">${forcastDays[i]}</h3>
              <h2 class="city-name" data-name="${name},${country}">
                <span class="name-smaller">${name}</span>
                <sup class="name-smaller">${country}</sup>
              </h2>
              <div class="city-temp2">${Math.round(daily[i].temp.day)}<sup class="sup2">°C</sup></div>
              <div> Wind: ${daily[i].wind_speed} m/s </div>
              <br>
              <div> Humidity: ${daily[i].humidity} % </div>
              <br>
              <div class="uvi" id="${daily[i].uvi}"> UV index: ${daily[i].uvi} </div>
              <figure>
                <img class="city-icon" src="${icon2}" alt="${daily[i].weather[0]["description"]}">
                <figcaption>${daily[i].weather[0]["description"]}</figcaption>
              </figure>

            </li>
          `)  
        }
        renderUVI();        
    });
}

var fetchCity = function(url){
  fetch(url)
    .then(response => response.json())
    .then(data => {
        // console.log(data)
      const { main, name, sys , wind , coord } = data;      
      
        $(".cities")
        .append(`
          <li class="city">
              <h3 class="date">${today}</h3>
              <h2 class="city-name" data-name="${name},${sys.country}">
              <span>${name}</span>
              <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <div> Wind: ${wind.speed} m/s </div>
          <br>
          <div> Humidity: ${main.humidity} % </div>
          <br>
          </li>
        `) 

      fetchOneCall(coord.lat, coord.lon, name, sys.country);
      
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
      forecastText.hide()
    });
}

function renderUVI(){
    var selectUVI = $(".uvi");
    //This will puch the past present future class to each row.
    $.each(selectUVI, function (i, uvi) {
        var getId = parseInt($(this).attr("id"));
        if (getId >= 0 && getId<3) {
            $(this).addClass("uvi-green");
            }
        else if (getId >= 3 && getId<6) {
        $(this).addClass("uvi-yellow");
            }
        else if (getId >= 6 && getId<8) {
            $(this).addClass("uvi-orange");
                }
        else if (getId >= 8 && getId<11) {
            $(this).addClass("uvi-red");
                }
        else if (getId >= 11) {
            $(this).addClass("uvi-violet");
                }
    });
}

function renderEmptyUrl(inputVal){
  theSearches.push(inputVal)
  $('#search-list').empty()
  theSearches = theSearches.map(function(x){ return x.toUpperCase(); })
  theSearches.sort()
  var unique = theSearches.filter((v, i, a) => a.indexOf(v) === i);
  
  theSearches = unique;
  localStorage.setItem("Weather", JSON.stringify(unique));
  
  searchListRender()

  $('.cities').empty()
  $('.forecasts').empty()

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`; 
  return url
}

form.addEventListener("submit", event => {
  event.preventDefault();  
  msg.textContent = "";
  let inputVal = input.value.trim();
  if (inputVal === "") {
    return;
  }  
  var url = renderEmptyUrl(inputVal)
  fetchCity(url)

  msg.textContent = "";
  form.reset();
  input.focus();
});

var searchLink = function(){
  $("li.saved-search").on("click",function(event) {  
    var element = event.target; 
    // console.log(element.textContent)
    var city = element.childNodes[0].nodeValue.trim()
    // console.log(city) 
    // console.log('testing');
    var url = renderEmptyUrl(city)
    fetchCity(url)
  });
}

function init() {    
  searchListRender();
}

init()