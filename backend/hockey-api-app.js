// Code based on template from https://github.com/Codecademy/deploying-backend-with-heroku-sample

const express = require('express'); // import express module (simplifies routing/requests, among other things)
const app = express(); // create an instance of the express module (app is the conventional variable name used)
const cors = require('cors');  // import cors module from express
const fetch = require('node-fetch'); // import node-fetch (enables the fetch API to be used server-side)
const PORT = process.env.PORT || 5000; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine
app.use(cors());

// converts application field titles to JSON keys for use with the NHL API
const jsonConversionDict = {'TEAM':['team', 'name'], 'ID':['team', 'id'], 'PTS':['points'], 'PTS%': ['pointsPercentage'], 
                                'GP':['gamesPlayed'], 'W':['leagueRecord', 'wins'], 'L':['leagueRecord', 'losses'], 
                                'OTL':['leagueRecord', 'ot'], 'RANK':['divisionRank']};
const scoreboardColumnList = [ 'RANK', 'TEAM', 'PTS', 'GP', 'PTS%', 'W', 'L', 'OTL'];
const NHL2021DivisionAlignmentDictionary = {0:'central', 1:'west', 2:'north', 3:'east'};

// Standings master data object
var divisionStandingsObject = {};

// Function that checks if an input value is a float
function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

function roundHundredths(n) {
  return Math.round(n * 100) / 100;
}

// Extract one row (one team's record info) of JSON data from the NHL API. Returns row as a dictionary.
function extractRowFromJsonObj(teamStandingJsonObject) {
  var newJsonRow = {};
  for ( var i = 0; i < scoreboardColumnList.length; i++) {
      var column = scoreboardColumnList[i];
      var jsonValue = teamStandingJsonObject;
      for ( var j=0; j < jsonConversionDict[column].length; j++) {
          var jsonLayer = jsonConversionDict[column][j];
          jsonValue = jsonValue[jsonLayer];
      }
      if (isFloat(jsonValue)) {
        jsonValue = roundHundredths(jsonValue);
      }
      newJsonRow[column] = jsonValue;
  }
  return newJsonRow;
}

// extract info from JSON returned from NHL API
function extractTableDataFromJson(teamStandingJsonObject) {
  var newJsonObject = {};
  for (var item in teamStandingJsonObject) {
      const team = teamStandingJsonObject[item];
      const teamObject = extractRowFromJsonObj(team);
      newJsonObject[teamObject.RANK] = teamObject;
  }
  return newJsonObject;
}

// extract all division info from JSON returned from NHL API
function extractStandingsDataFromJson(leagueStandingsByDivisionJsonObject) {
  var newJsonObject = {};
  for (key in leagueStandingsByDivisionJsonObject) {
    const newJsonKey = NHL2021DivisionAlignmentDictionary[key];
    newJsonObject[newJsonKey] = extractTableDataFromJson(leagueStandingsByDivisionJsonObject[key]['teamRecords']);
  }
  return newJsonObject;
}

app.get('/', (req, res) => { // send a get request to root directory ('/' is this file (hockey-api-app.js))
  fetch('https://statsapi.web.nhl.com/api/v1/standings') // fetch activity from NHL API 
    .then(res => res.json()) // return a promise containing the response
    .then(json => res.send(json)) // extracts the records value from the JSON responseand sends it to the client
    .catch(function(err){ // catch any errors
      console.log(err); // log errors to the console
    })
})

app.get('/standings', (req, res) => { // send a get request to root directory ('/' is this file (hockey-api-app.js))
  fetch('https://statsapi.web.nhl.com/api/v1/standings') // fetch activity from NHL API 
    .then(res => res.json()) // return a promise containing the response
    .then(json => res.send(extractStandingsDataFromJson(json.records))) // extracts the records value from the JSON responseand sends it to the client
    .catch(function(err){ // catch any errors
      console.log(err); // log errors to the console
    })
})

app.listen(PORT, () => { // start server and listen on specified port
  console.log(`App is running on ${PORT}`) // confirm server is running and log port to the console
}) 