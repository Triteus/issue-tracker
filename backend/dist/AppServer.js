"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const winston_1 = __importDefault(require("winston"));
const passport_1 = __importDefault(require("./startup/passport"));
const db_1 = __importDefault(require("./startup/db"));
const logging_1 = __importDefault(require("./startup/logging"));
const core_1 = require("@overnightjs/core");
const auth_1 = require("./routes/auth/auth");
const user_1 = require("./routes/user/user");
const error_1 = __importDefault(require("./middlewares/error"));
const file_1 = require("./routes/file/file");
const project_1 = require("./routes/v2/project/project");
const home_1 = require("./routes/home/home");
const global_1 = require("./routes/global/global");
const visitor_1 = require("./startup/visitor");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
require('express-async-errors');
class AppServer extends core_1.Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
        // Body Parser Middleware
        this.app.use(body_parser_1.default.json({ limit: '50mb' }));
        this.app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        //CORS Middleware
        this.app.use(function (req, res, next) {
            //Enabling CORS 
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
            res.header("Access-Control-Expose-Headers", "*");
            next();
        });
        // Create link to Angular build directory
        const distDir = "../../frontend/issue-tracker/dist/issue-tracker/";
        const test = path_1.default.join(__dirname, distDir);
        console.log('disDir', test);
        this.app.use(express_1.default.static(test));
        db_1.default();
        visitor_1.createVisitorIfNotExists();
        logging_1.default();
        passport_1.default();
        this.setupControllers();
        //setup error middleware
        this.app.use(error_1.default);
    }
    /** Add new controllers here */
    setupControllers() {
        const globalController = new global_1.GlobalController();
        const authController = new auth_1.AuthController();
        const userController = new user_1.UserController();
        const uploadController = new file_1.FileController();
        const projectController = new project_1.ProjectController();
        const homeController = new home_1.HomeController();
        super.addControllers([globalController, authController, userController, uploadController, projectController, homeController]);
    }
    start(port) {
        //Setting up server
        this.app.listen(port || 8080, function () {
            winston_1.default.log('info', `Server running on ${port}`);
        });
    }
}
exports.AppServer = AppServer;
//# sourceMappingURL=AppServer.js.map