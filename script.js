let locationData;
const pointsURL = "https://api.weather.gov/points/";
const forecastURL = "https://api.weather.gov/gridpoints/TOP/";
const forecastURLSuffix = "/forecast/hourly";
let pointData;
let forecast;
let periodData;
let displayWindDirection=false

function preload(){
locationData = { latitude: 40.137, longitude: -75.2157};
fetchPointData();
}

function fetchPointData() {
const url = pointsURL + `${locationData.latitude},${locationData.longitude}`;
  pointData = loadJSON(url,() => fetchForecast(),() => loadError(url));
}

function fetchForecast() {
const url = forecastURL + `${pointData.properties.gridX},${pointData.properties.gridY}` + forecastURLSuffix;
console.log(url);
  forecast = loadJSON(url, () => console.log(`${url} load success`), ()=>loadError(url));
}

function calculatePeriodData() {
  if( !periodData ) {
periodData = {mean:0, min:Infinity, max:-Infinity};
    for( let period of forecast.properties.periods ) {
      periodData.mean += period.temperature;
      if( period.temperature < periodData.min ) {
        periodData.min = period.temperature;
      }

      if( period.temperature > periodData.max ) {
        periodData.max = period.temperature;
      }
    }
    periodData.mean /= forecast.properties.periods.length;
  }
}

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
console.log(forecast);
  background("black");
}

function draw() {
  if( forecast ) {
    calculatePeriodData();
    let w = width/forecast.properties.periods.length;
    for( let i = 0; i < forecast.properties.periods.length; i++ ) {
      fill(lerpColor(
        color(10,200,255),
        color(255,200,10),
        map(forecast.properties.periods[i].temperature, periodData.min,periodData.max,0,1)));
      let y = height/2 - w + map(
        forecast.properties.periods[i].temperature,
        periodData.min,
        periodData.max,
        200,
        -200);
      rect( i * w, y, y/10, w*100);
    }
  }
}

function drawNow() {

text('Current Weather\n' + forecast.properties.periods[2].temperature + " degrees F " + forecast.properties.periods[2].windSpeed + " " + forecast.properties.periods[2].windDirection + " " + forecast.properties.periods[2].shortForecast, 20, 20)

if (displayWindDirection){
  text(forcast.properties.periods[i].windDirection, i *w,y);
}
else {
  noStroke();
  circle(i*w,y,w);
}

}

function keyPressed() {
  if (key === "1"){
    displayWindDirection = !displayWindDirection;
    redraw();
  }
}

