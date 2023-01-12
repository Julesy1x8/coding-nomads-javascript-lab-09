let lat1;
let lng1;
let population;
let utcOffset;
let data;

function WAIT(e) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve ("resolved");
        }, e);
    }).catch(() => {
        throw "WAIT has failed"
    });
}

function log(e) {
  console.log(e);
}

function getPopulation(country) {

  fetch(
    "https://countriesnow.space/api/v0.1/countries/population"
  ).then(res => res.json())
  .then(popData => {
      console.log(popData);
      for (let i = 0;i < popData.data.length; i++) {
          if (popData.data[i].country.localeCompare(country) == 0)

              population = popData.data[i].populationCounts[popData.data[i].populationCounts.length - 1].value;
          document.getElementById('population').innerHTML = population;
      }
  }).catch("get population has failed");
}
function sunriseSunset() {
  console.log(lat1,lng1);
  fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat1}&lng=${lng1}&date=today`
  ) .then(res => res.json())
  .then(data => {
    let offsetArray = utcOffset.split("");
    let operator = offsetArray[0];
    let parsedHour = parseInt(offsetArray[1] + offsetArray[2]);
    let sunsetHourFinal;
    let sunriseHourFinal;
    let solarNoonFinal;
    let sunsetFinal;
    let sunriseFinal;
    let sunrise = data.results.sunrise;
    let sunset = data.results.sunset;
    let solarNoon = data.results.solar_noon;
    let dayLength = data.results.day_length;

    let sunriseArray = sunrise.split(":");
    let sunsetArray = sunset.split(":");
    let solarNoonArray = solarNoon.split(":");

    let sunriseHourUtc = sunriseArray[0];
    let sunsetHourUtc = sunsetArray[0];
    let solarNoonHourUtc = solarNoonArray[0];

    if (operator == "+") {
      sunriseHourFinal = parseInt(sunriseHourUtc) + parsedHour;
      sunsetHourFinal = parseInt(sunsetHourUtc) + parsedHour;
    } else {
      sunriseHourFinal = parseInt(sunriseHourUtc) - parsedHour;
      sunsetHourFinal = parseInt(sunsetHourUtc) - parsedHour;
    }
    let solarNoonHourFinal = solarNoonHourUtc - utcOffset;

    let sunriseAlmostFinal = `${sunriseHourFinal}:${sunriseArray[1]}:${sunriseArray[2]}`;
    sunsetFinal = `${sunsetHourFinal}:${sunsetArray[1]}:${sunsetArray[2]}`;
    solarNoonFinal = `${solarNoonHourFinal}:${solarNoonArray[1]}:${solarNoonArray[2]}`;

    sunriseFinal = sunriseAlmostFinal.replace("P","A");

    document.getElementById("sunrise").innerHTML = sunriseFinal;
    document.getElementById("sunset").innerHTML = sunsetFinal;
    document.getElementById("solarNoon").innerHTML = solarNoonFinal;
    document.getElementById("dayLength").innerHTML = dayLength;
  })
  .catch("sunriseSunset has failed")
}

function getLocalTime(e){
  let dateTimeSplit = e.split("T");
  let timeOffsetSplit = dateTimeSplit[1].split("-");
  let timeStringArray = timeOffsetSplit[0].split(":");
  let timeHour = timeStringArray[0];
  let timeMinutes = timeStringArray[1];
  let timeSeconds = timeStringArray[2];
  let offsetStringArray = timeOffsetSplit[1].split(":");
  let utcOffsetString = offsetStringArray[0];
  let utcOffest = parseInt(utcOffsetString);
  let intTimeHour = parseInt(timeHour);
  let localTime = intTimeHour - utcOffest;
  console.log(utcOffsetString);

  let timeString = `${localTime}:${timeMinutes}:${timeSeconds}`;

  let time = Date.parse(timeString);

  console.log(time);
  return timeString;
}
function loadPageInfo() {
  let ipData = fetch(
    'https://api.ipdata.co?api-key=0f90c45c7995b24d076e84153c84084cf70898cf543e341ea697af26'
  ).then(res => res.json())
  .then(dataAtempt => {
    lat1 = dataAtempt.latitude;
    lng1 = dataAtempt.longitude;

    console.log(`${lat1} *** ${lng1}`);

    data = dataAtempt;

  })
  .catch("loadPageInfo has failed");
  return ipData
}
function spacePeopleInSpace() {}
fetch(
    "http://api.open-notify.org/astros.json"
).then(res => res.json())
.then(data => {
    console.log(data.number);
    document.getElementById('spacePeopleInSpace').innerHTML = data.number;
})
.catch("spacePeopleInSpace has failed");

function ISScordinates() {}
fetch(
        "http://api.open-notify.org/iss-now.json"
        ).then(res => res.json())
.then(data => {
    document.getElementById('ISSlatitude').innerHTML = data.iss_position.latitude;
    document.getElementById('ISSlongitude').innerHTML = data.iss_position.longitude;

    ISSmap(data.iss_position.latitude, data.iss_position.longitude)
})
.catch("ISScordinates has failed");

function ISSmap(lat, lng) {
    var map = L.map('ISSmap').setView([lat,lng], 13);

    map.setZoom(1);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 13,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    var ISSicon = L.icon({
        iconUrl: 'http://open-notify.org/Open-Notify-API/map/ISSIcon.png',

    iconSize:     [50, 30], // size of the icon
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([51.5, -0.09], {icon: ISSicon}).addTo(map);
}

function domManipulation() {

  getPopulation(data.country_name);
  console.log(population);

  document.getElementById('ip').innerHTML = data.ip;
  document.getElementById('city').innerHTML = data.city;
  document.getElementById('country').innerHTML = data.country_name;
  document.getElementById('countryCode').innerHTML = data.country_code;
  document.getElementById('region').innerHTML = data.region;
  document.getElementById('latitude').innerHTML = data.latitude;
  document.getElementById('longitude').innerHTML = data.longitude;
  document.getElementById('timezone').innerHTML = data.time_zone.abbr;
  document.getElementById('time').innerHTML = getLocalTime(data.time_zone.current_time)
  document.getElementById('flagImg').innerHTML = data.emoji_flag;
  document.getElementById('language').innerHTML = data.languages[0].name;
  utcOffset = data.time_zone.offset;
}

async function myMap() {

  await WAIT(2000);

  console.log(`${lat1} *** ${lng1}`);

  var mapProp= {
    center:new google.maps.LatLng(lat1,lng1),
    zoom:5,
  };
  var map = new google.maps.Map(document.getElementById("map"),mapProp);
}
async function startPage() {

  await loadPageInfo();

  spacePeopleInSpace();
  ISScordinates();

  console.log(data);

  sunriseSunset();
  domManipulation();

  timeBasedStylings();
} startPage();
