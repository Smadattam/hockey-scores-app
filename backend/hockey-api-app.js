// Code based on https://github.com/Codecademy/deploying-backend-with-heroku-sample

const express = require('express'); // import express module (simplifies routing/requests, among other things)
const app = express(); // create an instance of the express module (app is the conventional variable name used)
const fetch = require('node-fetch'); // import node-fetch (enables the fetch API to be used server-side)
const PORT = process.env.PORT || 5000; // use either the host env var port (PORT) provided by Heroku or the local port (5000) on your machine

app.get('/', (req, res) => { // send a get request to root directory ('/' is this file (hockey-api-app.js))
  fetch('https://statsapi.web.nhl.com/api/v1/standings') // fetch activity from NHL API 
    .then(res => res.json()) // return a promise containing the response
    .then(json => res.send(json.records)) // extracts the records value from the JSON responseand sends it to the client
    .catch(function(err){ // catch any errors
      console.log(err); // log errors to the console
    })
})

app.listen(PORT, () => { // start server and listen on specified port
  console.log(`App is running on ${PORT}`) // confirm server is running and log port to the console
}) 