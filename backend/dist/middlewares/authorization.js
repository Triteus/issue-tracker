"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const util_1 = require("util");
const error_1 = require("./error");
const message = 'Missing permissions!';
// we assume that admin can access everything
exports.default = {
    hasRoles: function (roles) {
        return function (req, res, next) {
            const user = req.user;
            if (user.roles.includes(user_model_1.ERole.Admin)) {
                return next();
            }
            if (!util_1.isArray(roles)) {
                if (!user.roles.includes(roles)) {
                    throw new error_1.ResponseError(message, error_1.ErrorTypes.NOT_AUTHORIZED);
                }
                return next();
            }
            for (let role of roles) {
                if (!user.roles.includes(role)) {
                    throw new error_1.ResponseError(message, error_1.ErrorTypes.NOT_AUTHORIZED);
                }
            }
            return next();
        };
    },
    hasOneRole: function (roles) {
        return function (req, res, next) {
            const user = req.user;
            if (user.roles.includes(user_model_1.ERole.Admin)) {
                return next();
            }
            if (!util_1.isArray(roles)) {
                if (!user.roles.includes(roles)) {
                    throw new error_1.ResponseError(message, error_1.ErrorTypes.NOT_AUTHORIZED);
                }
                return next();
            }
            for (let role of roles) {
                if (user.roles.includes(role)) {
                    return next();
                }
            }
            throw new error_1.ResponseError(message, error_1.ErrorTypes.NOT_AUTHORIZED);
        };
    },
    isAccOwner: function () {
        return function (req, res, next) {
            const user = req.user;
            if (user.roles.includes(user_model_1.ERole.Admin)) {
                return next();
            }
            if (user._id.toString() === req.params.id) {
                return next();
            }
            else {
                throw new error_1.ResponseError(message, error_1.ErrorTypes.NOT_AUTHORIZED);
            }
        };
    },
};
//# sourceMappingURL=authorization.js.map