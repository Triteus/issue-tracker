import bodyParser from "body-parser";
import winston from 'winston';

import initPassport from './startup/passport'
import initDB from './startup/db';
import initLogging from './startup/logging';

import { Server } from "@overnightjs/core";
import { AuthController } from "./routes/auth/auth";
import { UserController } from "./routes/user/user";
import error from "./middlewares/error";
import { TicketController } from "./routes/ticket/ticket";

require('express-async-errors');

export class AppServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
       
        // Body Parser Middleware
        this.app.use(bodyParser.json());
        
        initDB();
        initLogging();
        initPassport();

        this.setupControllers();
        //setup error middleware
        this.app.use(error);
    }

    /** Add new controllers here */
    private setupControllers(): void {
        const authController = new AuthController();
        const userController = new UserController();
        const ticketController = new TicketController();
        super.addControllers([authController, userController, ticketController]);
    }

    public start(port: number): void {
        //Setting up server
        this.app.listen(port || 8080, function () {
            winston.log('info', `Server running on ${port}`);
        });
    }
}



