"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
function default_1() {
    mongoose_1.default.connect(config_1.default.get('mongoDbUrl'), {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    mongoose_1.default.Promise = global.Promise;
    const db = mongoose_1.default.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}
exports.default = default_1;
;
//# sourceMappingURL=db.js.map