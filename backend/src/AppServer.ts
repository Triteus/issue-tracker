import bodyParser from "body-parser";
import winston from 'winston';

import initPassport from './startup/passport'
import initDB from './startup/db';
import initLogging from './startup/logging';

import { Server } from "@overnightjs/core";
import { AuthController } from "./routes/auth";
import { UserController } from "./routes/user";

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
        const userController = new UserController();
        super.addControllers([authController, userController]);
    }

    public start(port: number): void {
        //Setting up server
        this.app.listen(port || 8080, function () {
            winston.log('info', `Server running on ${port}`);
        });
    }
}



