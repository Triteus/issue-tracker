"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { MongoDB } = require("winston-mongodb");
function default_1() {
    //Exceptions outside of api-calls
    winston_1.default.exceptions.handle(new winston_1.default.transports.File({ filename: "uncaughtExceptions.log" }), new winston_1.default.transports.Console({}));
    //standard logging on console
    winston_1.default.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple(),
    }));
    process.on("unhandledRejection", ex => {
        throw ex; //let winston handle it
    });
    winston_1.default.add(new winston_1.default.transports.File({ filename: "logfile.log" }));
    winston_1.default.add(new MongoDB({
        db: "mongodb://localhost/legends",
        level: "error"
    }));
}
exports.default = default_1;
;
//# sourceMappingURL=logging.js.map