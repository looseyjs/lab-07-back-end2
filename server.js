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

// Make the server
const app = express();

app.use(cors());
// app.get('/location') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
app.get('/location', searchToLatLng);

// app.get('/weather') is a route that is an exposed endpoint that is opened with express.
// this takes in a request and a response.  the request is what the user is requesting.
// the response is what the code sends back. the response either processes the request successfully or sends a message that says something went wrong.
// app.get('/weather', (request, response) => {
//   try {
//     //if data is accessible, then the user request can be processed and sent off as a response
//     //this data is based on the location that the user entered
//     const weatherData = weatherForecast(request.query.data);
//     //this is the data sent back that matches to the user request
//     //the data will be sent to /weather
//     response.send(weatherData);
//   } catch (e) {
//     //if data can't be reached, a 500 status is shown. 500 status means that the data is unavailable
//     response.status(500).send('Status 500: Sorry I broke while finding weather data');
//   }
// })

app.use('*', (request, response) => {
  response.send('you got to the wrong place');
})

// function weatherForecast() {
//   const darkSkyData = require('./data/darksky.json');
//   let weatherData = darkSkyData.daily.data.map(el => ({
//     forecast: el.summary,
//     time: new Date(el.time * 1000).toDateString()
//   }))
//   console.log(weatherData);
//   return weatherData;
// }

//refactror the callback function with the error handling using catch error
function searchToLatLng (request, response){
  const locationName = request.query.data;
  console.log(locationName);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName}&key=${process.env.GEOCODE_API_KEY}`;
  superagent.get(url)
    .then( result => {
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
