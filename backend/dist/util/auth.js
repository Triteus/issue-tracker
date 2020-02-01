"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
function isAccOwner(userId, ownerId) {
    return userId.toString() === ownerId.toString();
}
exports.isAccOwner = isAccOwner;
function hasSupportRole(req) {
    return req.user.roles.includes(user_model_1.ERole.Support);
}
exports.hasSupportRole = hasSupportRole;
//# sourceMappingURL=auth.js.map