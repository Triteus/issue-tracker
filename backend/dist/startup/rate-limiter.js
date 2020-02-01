"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function default_1(app) {
    // needed for deployment
    app.set('trust proxy', 1);
    const apiLimiter = express_rate_limit_1.default({
        windowMs: 15 * 60 * 1000,
        max: 200
    });
    app.use("/api/", apiLimiter);
}
exports.default = default_1;
//# sourceMappingURL=rate-limiter.js.map