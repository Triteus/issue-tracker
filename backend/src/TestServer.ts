import { Server } from "@overnightjs/core";
import { Application } from "express";
import bodyParser = require("body-parser");
import initPassport from "./startup/passport";
import error from "./middlewares/error";
import { IService, ServiceInjector } from "./ServiceInjector";

require('express-async-errors');

export class TestServer extends Server {
    constructor() {
        super(process.env.NODE_ENV === 'test');
        // Body Parser Middleware
        this.app.use(bodyParser.json());

        //initLogging();
        initPassport();
    }

    public setServicesForChildControllers(serviceMapping: {[key: string]: IService}) {
        ServiceInjector.setServices(serviceMapping);
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