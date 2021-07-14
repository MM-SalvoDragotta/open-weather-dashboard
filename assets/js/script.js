// function renderLocalStorage(){
//     var inputUserHours = document.getElementsByTagName('input');
//     for (var i=0; i< hourArray.length ; i++) {
//         var localStorageValue = JSON.parse(localStorage.getItem(hourArray[i].replace(/\s/g, '')));
//         inputUserHours[i].value = localStorageValue 
//     }
// }

// $(".btn").click(function(event){
//     // console.log(event.target.parentElement.previousElementSibling);
//     // console.log(event.target.parentElement.previousElementSibling.id)
//     // console.log(event.target.parentElement.previousElementSibling.getAttribute("data-hour"))
//     // console.log(event.target.parentElement.previousElementSibling.value);    
//     // console.log(event.target.parentElement)
//     // console.log(event.target.parentElement.id)
//     var storageName = event.target.parentElement.previousElementSibling.getAttribute("data-hour");
//     var storageValue = event.target.parentElement.previousElementSibling.value
//     localStorage.setItem(storageName, JSON.stringify(storageValue));


// function init() {    
    
// }

// var lat =  -33.8679;
// var lon = 151.2073;

const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
var forecastText = $("#forecast")

const apiKey = "c5dae5a8e270024cd9fe6d4e536b2b74"
const key = "c5dae5a8e270024cd9fe6d4e536b2b74"

var today = moment(new Date()).format('ddd [, ] Do MMMM YYYY')

var forcastDays = []

for (var i=1; i<6; i++){
  futureDay = moment().add(i,'days').format('ddd [, ] Do MMMM YYYY')
  forcastDays.push(futureDay)
}
console.log(forcastDays)

// var tomorrow  = moment().add(1,'days').format('ddd [, ] Do MMMM YYYY')

var fetchOneCall = function (lat, lon, name, country) {
    const oneCallEndpointUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${key}`;
    fetch(oneCallEndpointUrl)
    .then(response => response.json())
    .then(data => {        
        const {current , daily } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${current.weather[0]["icon"]}.svg`; 
        console.log(data)
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
        console.log(daily[0].temp.day)
        console.log(daily[0].wind_speed)
        console.log(daily[0].humidity)
        console.log(daily[0].uvi)
        const icon2 = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${daily[0].weather[0]["icon"]}.svg`; 
        for (i=0; i<5; i++){
          forecastText.show()
          forecastText.css({'padding':'50px','padding-left':'10px'} )
        $(".forecasts")
          .append(`
            <li class="forecast">
                <h3 class="date">${forcastDays[i]}</h3>
                <h2 class="city-name" data-name="${name},${country}">
                <span>${name}</span>
                <sup>${country}</sup>
            </h2>

            </li>
          `)  
        }
      

        // for (var i=0;i<5;i++){
        //   $(".forecast")
        //   .append(`
        //   <div class="uvi" id="${current.uvi}"> UV index: ${current.uvi} </div>
        //   <figure>
        //     <img class="city-icon" src="${icon}" alt="${current.weather[0]["description"]}">
        //     <figcaption>${current.weather[0]["description"]}</figcaption>
        //   </figure>
        //   `)  
        // }
        renderUVI();        
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

form.addEventListener("submit", e => {
  e.preventDefault();  
  msg.textContent = "";
  let inputVal = input.value;
  $('.cities').empty()
  $('.forecasts').empty()

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`; 

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
      // console.log(test);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
      forecastText.hide()
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});


