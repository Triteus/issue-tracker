import bodyParser from "body-parser";
import winston from 'winston';

import appConf from '../config.json';
import initPassport from './startup/passport'
import initDB from './startup/db';
import initLogging from './startup/logging';

import { Server } from "@overnightjs/core";
import { AuthController } from "./routes/auth";

export class AppServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
       
        // Body Parser Middleware
        this.app.use(bodyParser.json());
        
        initDB();
        initLogging();
        initPassport();

        this.setupControllers();
    }

    /** Add new controllers here */
    private setupControllers(): void {
        const authController = new AuthController();
        super.addControllers([authController]);
    }

    public start(port: number): void {
        //Setting up server
        this.app.listen(port || 8080, function () {
            winston.log('info', `Server running on ${port}`);
        });
    }
}

const server = new AppServer();
server.start(appConf.serverPort);



