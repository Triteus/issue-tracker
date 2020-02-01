"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const user_model_1 = require("../../models/user.model");
const error_1 = require("../../middlewares/error");
const passport_1 = __importDefault(require("passport"));
function excludeRoutes(routes) {
    return (req, res, next) => {
        for (let route of routes) {
            if (req.originalUrl.includes(route)) {
                res.locals.routeExcluded = true;
                return next();
            }
        }
        passport_1.default.authenticate('jwt', { session: false })(req, res, () => {
            next();
        });
    };
}
let GlobalController = class GlobalController {
    async postAction(req, res, next) {
        if (res.locals.routeExcluded) {
            return next();
        }
        const roles = req.user.roles;
        if (roles.includes(user_model_1.ERole.Visitor)) {
            throw new error_1.ResponseError('Visitors cannot create any resources', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }
    async putAction(req, res, next) {
        const roles = req.user.roles;
        if (roles.includes(user_model_1.ERole.Visitor)) {
            throw new error_1.ResponseError('Visitors cannot update any resources', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }
    async patchAction(req, res, next) {
        const roles = req.user.roles;
        if (roles.includes(user_model_1.ERole.Visitor)) {
            throw new error_1.ResponseError('Visitors cannot update any resources', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }
    async deleteAction(req, res, next) {
        const roles = req.user.roles;
        if (roles.includes(user_model_1.ERole.Visitor)) {
            throw new error_1.ResponseError('Visitors cannot delete any resources', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }
};
__decorate([
    core_1.Post(),
    core_1.Middleware([
        excludeRoutes(['login', 'register'])
    ])
], GlobalController.prototype, "postAction", null);
__decorate([
    core_1.Put(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], GlobalController.prototype, "putAction", null);
__decorate([
    core_1.Patch(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], GlobalController.prototype, "patchAction", null);
__decorate([
    core_1.Delete(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], GlobalController.prototype, "deleteAction", null);
GlobalController = __decorate([
    core_1.Controller('api/*')
], GlobalController);
exports.GlobalController = GlobalController;
//# sourceMappingURL=global.js.map