import { Server } from "@overnightjs/core";
import { Application } from "express";
import bodyParser = require("body-parser");
import initPassport from "./startup/passport";
import initLogging from "./startup/logging";
import error from "./middlewares/error";

require('express-async-errors');

export class TestServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
        // Body Parser Middleware
        this.app.use(bodyParser.json());

        initLogging();
        initPassport();
    }

    public setControllers(controllers: any | any[]): void {
        super.addControllers(controllers);
         //setup error middleware
         this.app.use(error);
    }

    public getExpressInstance(): Application {
        return this.app;
    }
}