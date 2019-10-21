//Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const app = express(); 
const appConf = require('../config');
const winston = require('winston');

// Body Parser Middleware
app.use(bodyParser.json()); 

// connect to database
require('./startup/db')();
require('./startup/logging')();

//Setting up server
 const server = app.listen(appConf.serverPort || 8080, function () {
    var port = server.address().port;
    winston.log('info', `Server running on ${appConf.serverPort}`); 
});
