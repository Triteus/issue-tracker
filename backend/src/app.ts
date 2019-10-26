//Initiallising node modules
import express from "express";
import bodyParser from "body-parser";
import winston from 'winston';

import appConf from '../config.json';
import initPassport from './startup/passport'
import initDB from './startup/db';
import initLogging from './startup/logging';
import initRoutes from './startup/routes';

const app = express();

// Body Parser Middleware
app.use(bodyParser.json()); 

initDB();
initLogging();
initPassport();
initRoutes(app);


//Setting up server
 const server = app.listen(appConf.serverPort || 8080, function () {
    winston.log('info', `Server running on ${appConf.serverPort}`); 
});
