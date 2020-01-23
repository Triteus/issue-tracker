import bodyParser from "body-parser";
import winston from 'winston';

import initPassport from './startup/passport'
import initDB from './startup/db';
import initLogging from './startup/logging';

import { Server } from "@overnightjs/core";
import { AuthController } from "./routes/auth/auth";
import { UserController } from "./routes/user/user";
import error, { ResponseError, ErrorTypes } from "./middlewares/error";
import { FileController } from "./routes/file/file";
import { ProjectController } from "./routes/v2/project/project";
import { HomeController } from "./routes/v2/home/home";
import { GlobalController } from "./routes/global/global";
import { createVisitorIfNotExists } from "./startup/visitor";
import express from 'express';
import path from 'path';

require('express-async-errors');

export class AppServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');

        // Body Parser Middleware
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        //CORS Middleware

        this.app.use(function (req, res, next) {
            //Enabling CORS 
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
            res.header("Access-Control-Expose-Headers", "*")

            next();
        });

        // Create link to Angular build directory
        const distDir = "../../frontend/issue-tracker/dist/issue-tracker/";
        const finalPath = path.join(__dirname, distDir);

        this.app.use(express.static(finalPath));

        initDB();
        createVisitorIfNotExists();
        initLogging();
        initPassport();

        this.setupControllers();

        // needed to avoid returning index.html
        this.app.get('/api/*', (req, res, next) => {
            res.status(404).send(
                { error: `Cannot GET ${req.url} . API has no such route!` }
            );
        })

        /* final catch-all route to index.html defined last */
        this.app.get('/*', (req, res) => {
            res.sendFile(path.join(finalPath, '/index.html'));
        })

        //setup error middleware
        this.app.use(error);
    }

    /** Add new controllers here */
    private setupControllers(): void {
        const globalController = new GlobalController();
        const authController = new AuthController();
        const userController = new UserController();
        const uploadController = new FileController();
        const projectController = new ProjectController();
        const homeController = new HomeController();
        super.addControllers([globalController, authController, userController, uploadController, projectController, homeController]);
    }

    public start(port: number): void {
        //Setting up server
        this.app.listen(port, function () {
            winston.log('info', `Server running on ${port}`);
        });
    }
}



