# lab-07-back-end
# Project Name

**Author**: [Roman](https://github.com/rttgg) and [BomiBear](https://github.com/bomibear)
**Version**: 1.0.5

## Overview
This app allows a user to search for a city, see the weather forecast, and events happening in the city.  Three API calls are made, which includes the Google Maps API, the Dark Sky API, and the EventBrite API.

## Getting Started
In order to run this locally, follow these steps after cloning the repo:
```
npm install dotenv
npm install express
npm install superagent
npm install cors
```
Open the code in your favorite editor and create a new file called ```.env``` at the root level. In there specify the PORT that you want the application to run on, like ```PORT=3000```.  Within terminal, type in ```nodemon``` to run the server.

Head over to Google and grab a Google Maps API Key.  Enable the Google Maps Static API.  Afterwards, head to the [front end of the application](https://codefellows.github.io/code-301-guide/curriculum/city-explorer-app/front-end/).  Put in the Google Maps API key, and use this address for the url ```https://citylookup2.herokuapp.com```.

## Architecture
This application is built with JavaScript, Node.js, Express, SuperAgent and the deployed link is hosted on Heroku.

## Change Log
07-14-2019 7pm - Locations constructor has been debugged.  A constructor for events is made.  API calls for the map, weather and events api all functioning.  The deployed link works.

07-11-2019 10am - Constructor for location is made, but the data is not populating.  Constructor still needs work.

07-10-2019 1:30pm - Connection is made with the Google Maps API, but the constructor for location needs work.

## Credits and Collaborations
[Roman](https://github.com/rttgg) and [BomiBear](https://github.com/bomibear)