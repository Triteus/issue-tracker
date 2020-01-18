"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
function isAccOwner(userId, ownerId) {
    return userId.toString() === ownerId.toString();
}
exports.isAccOwner = isAccOwner;
function hasSupportRole(req) {
    return req.user.roles.includes(User_1.ERole.Support);
}
exports.hasSupportRole = hasSupportRole;
//# sourceMappingURL=auth.js.map