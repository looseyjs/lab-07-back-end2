'use strict';

// first run npm init from the terminal to create "package.json"
// `npm install dotenv` installs the dotenv module into the node module folder
// loads our environment from a secret .env file

// APP dependencies
require('dotenv').config();
const superagent = require('superagent');

const express = require('express');
const cors = require('cors');

// Global vars
const PORT = process.env.PORT;

// Server instantiation and middleware
const app = express();
app.use(cors());

//Weather constructor
function Weather(forecast, time) {
  this.forecast = forecast;
  this.time = time
}

//Location constructor
function Location(query, formatted_query, lat, long) {
  this.query = query;
  this.formatted_query = formatted_query;
  this.lat = lat;
  this.long = long;
}

// app.get('/location') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/location', searchToLatLng);

// app.get('/weather') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/weather', weatherForecast);

app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

function weatherForecast(request, response) {
  const locationName = request.query.data;
  console.log(locationName);
  const lat = request.query.data.latitude;
  const long = request.query.data.longitude;
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${lat},${long}`;
  superagent.get(url)
    .then( result => {
      let forecast = result.body.daily.data.map(day => new Weather(day.summary, new Date(day.time * 1000).toDateString()));
      response.send(forecast);
    }).catch(e => {
      console.error(e);
      response.status(500).send('Status 500: Sorry I broke');
    })
}

//refactror the callback function with the error handling using catch error
function searchToLatLng (request, response){
  const locationName = request.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then( result => {
      // console.log('name is ' + locationName);
      // console.log('request query data is ' + request.query.data);
      // console.log('result is ' + result.body.results[0].locationName);
      // console.log('address is ' + result.body.results[0].formatted_address);
      // console.log('lat is ' + result.body.results[0].geometry.location.lat);
      // console.log('long is ' + result.body.results[0].geometry.location.lng);
      // response.send(new Location(
      //   locationName,
      //   result.body.results[0].formatted_address,
      //   result.body.results[0].geometry.location.lat,
      //   result.body.results[0].geometry.location.lng));
      let location = {
        search_query: locationName,
        formatted_query: result.body.results[0].formatted_address,
        latitude: result.body.results[0].geometry.location.lat,
        longitude: result.body.results[0].geometry.location.lng,
      }
      response.send(location);
    }).catch(e => {
      console.error(e);
      response.status(500).send('Status 500: Sorry I broke');
    })
}

// Start the server
app.listen(PORT, () => {
  console.log(`Our app is up on port ${PORT}`)
})
