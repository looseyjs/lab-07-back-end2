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
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toDateString();
}

function Locations(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng
}

function Event(data) {
  this.name = data.name.text;
  this.link = data.url;
  this.event_date = new Date(data.start.local).toDateString();
  this.summary = data.description.text;
}

// app.get('/location') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/location', searchToLatLng);

// app.get('/weather') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/weather', weatherForecast);

app.get('/events', eventSearch);

app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

function eventSearch(request, response) {
  const lat = request.query.data.latitude;
  const lng = request.query.data.longitude;
  const url = `https://www.eventbriteapi.com/v3/events/search/?token=${process.env.EVENTBRITE_API_KEY}&location.latitude=${lat}&location.longitude=${lng}`
  superagent.get(url)
    .then( result => {
      let allEvents = result.body.events.map( event => {
        return new Event(event);
      });
      response.send(allEvents);
    }).catch(error => handleError(error, response));
}

function weatherForecast(request, response) {
  const lat = request.query.data.latitude;
  const long = request.query.data.longitude;
  const url = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_KEY}/${lat},${long}`;
  superagent.get(url)
    .then( result => {
      let forecast = result.body.daily.data.map(day => new Weather(day));
      response.send(forecast);
    }).catch(error => handleError(error, response));
}

//refactror the callback function with the error handling using catch error
function searchToLatLng (request, response){
  let locationName = request.query.data;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then( result => {
      let location = new Locations(locationName, result);
      response.send(location);
    }).catch(error => handleError(error, response));
}

//Error handling function
function handleError(error, response) {
  console.log('Error: ', error);
  response.status(500).send('Status 500: Error occured! Refer to the log for more information');
}

// Start the server
app.listen(PORT, () => {
  console.log(`Our app is up on port ${PORT}`)
})
