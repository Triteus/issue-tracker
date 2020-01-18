"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppServer_1 = require("./AppServer");
const config_1 = __importDefault(require("config"));
const server = new AppServer_1.AppServer();
server.start(config_1.default.get('serverPort'));
//# sourceMappingURL=app.js.map