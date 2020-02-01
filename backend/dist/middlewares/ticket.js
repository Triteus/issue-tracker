"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../models/user.model");
const error_1 = require("./error");
/**
 * Middelware that checks if user was added to the project
 * Should always be called after authentication middleware, which adds user to request object
 *
 * @param req Request including user
 * @param res
 * @param next
 */
function userBelongsToProject(req, res, next) {
    const project = res.locals.project;
    const user = req.user;
    if (user.roles.includes(user_model_1.ERole.Admin)) {
        return next();
    }
    if (project.assignedUsers.includes(user._id)) {
        next();
    }
    else {
        next(new error_1.ResponseError('Missing permissions (not assigned to project)', error_1.ErrorTypes.NOT_AUTHORIZED));
    }
}
exports.userBelongsToProject = userBelongsToProject;
function findTicket(req, res, next) {
    const ticketId = req.params.ticketId;
    const project = res.locals.project;
    const ticket = project.tickets.id(ticketId);
    if (!ticket) {
        throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
    }
    res.locals = { ...res.locals, ticket };
    next();
}
exports.findTicket = findTicket;
//# sourceMappingURL=ticket.js.map