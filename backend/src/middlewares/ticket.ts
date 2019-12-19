import { Request, Response, NextFunction } from "express";
import { RequestWithUser, ERole } from "../models/User";
import { IProject } from "../models/Project";
import { ResponseError, ErrorTypes } from "./error";

/**
 * Middelware that checks if user was added to the project
 * Should always be called after authentication middleware, which adds user to request object
 * 
 * @param req Request including user 
 * @param res
 * @param next 
 */
export function userBelongsToProject(req: RequestWithUser, res: Response, next: NextFunction) {
    const project = res.locals.project as IProject;
    const user = req.user;

    if (user.roles.includes(ERole.Admin)) {
        return next();
    }

    if (project.assignedUsers.includes(user._id)) {
        next();
    } else {
        next(new ResponseError('Missing permissions (not assigned to project)', ErrorTypes.NOT_AUTHORIZED));
    }
}