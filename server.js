'use strict';

// first run npm init from the terminal to create "package.json"
// `npm install dotenv` installs the dotenv module into the node module folder
// loads our environment from a secret .env file

// APP dependencies
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Global vars
const PORT = process.env.PORT;
// Make my server
const app = express();
app.use(cors());
// app.get('/location') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/location', (request, response) => {
  try {
    //brings in the data that was entered on the front end and sends it to searchToLatLng
    const locationData = searchToLatLng(request.query.data);
    //if data is accessible, then the user request can be processed and sent off as a response
    //the data will be sent to /location
    response.send(locationData);
  } catch (e) {
    //if data can't be reached, a 500 status is shown. 500 status means that the data is unavailable
    response.status(500).send('Status 500: So sorry i broke')
  }
})

//Route for weather
app.get('/weather', (request, response) => {
  try {
    const weatherData = weatherForecast(request.query.data);
    response.send(weatherData);
  } catch (e) {
    response.status(500).send('Status 500: Sorry I broke while finding weather data');
  }
})

app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

function weatherForecast() {
  //Constructor for weather data
  const weather = [];
  const darkSkyData = require('./data/darksky.json');
  darkSkyData.daily.data.forEach(item => {
    let obj = {
      forecast: item.summary,
      time: new Date(item.time * 1000).toDateString()
    }
    weather.push(obj);
  })
  return weather;
}

function searchToLatLng(locationName) {
  const geoData = require('./data/geo.json');
  const location = {
    search_query: locationName,
    formatted_query: geoData.results[0].formatted_address,
    latitude: geoData.results[0].geometry.location.lat,
    longitude: geoData.results[0].geometry.location.lng
  }
  return location;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Our app is up on port ${PORT}`)
})
