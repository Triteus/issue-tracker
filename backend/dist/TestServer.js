"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const bodyParser = require("body-parser");
const passport_1 = __importDefault(require("./startup/passport"));
const error_1 = __importDefault(require("./middlewares/error"));
require('express-async-errors');
class TestServer extends core_1.Server {
    constructor() {
        super(process.env.NODE_ENV === 'development');
        // Body Parser Middleware
        this.app.use(bodyParser.json());
        //initLogging();
        passport_1.default();
    }
    setControllers(controllers) {
        super.addControllers(controllers);
        //setup error middleware
        this.app.use(error_1.default);
    }
    getExpressInstance() {
        return this.app;
    }
}
exports.TestServer = TestServer;
//# sourceMappingURL=TestServer.js.map