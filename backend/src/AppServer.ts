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
import cors from 'express';
import { FileController } from "./routes/file/file";
import { ProjectController } from "./routes/v2/project/project";

require('express-async-errors');

export class AppServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');

        // Body Parser Middleware
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        //CORS Middleware

         this.app.use(function (req, res, next) {
            //Enabling CORS 
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
            res.header("Access-Control-Expose-Headers", "*")
            
            next();
        }); 

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
        const uploadController = new FileController();
        const projectController = new ProjectController();
        super.addControllers([authController, userController, uploadController, projectController]);
    }

    public start(port: number): void {
        //Setting up server
        this.app.listen(port || 8080, function () {
            winston.log('info', `Server running on ${port}`);
        });
    }
}



