import { Request, Response, NextFunction } from "express";
import { RequestWithUser, ERole } from "../models/User";
import { IProject } from "../models/Project";
import { ResponseError, ErrorTypes } from "./error";
import { ITicket } from "../models/Ticket";
import { ResponseWithProject } from "./project";


export interface ResponseWithTicket extends Response {
    locals: {
        ticket: ITicket,
        [key: string]: any
    }
}

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

export function findTicket(req: RequestWithUser, res: ResponseWithProject, next: NextFunction) {
    const ticketId = req.params.ticketId;
    const project = res.locals.project;
    const ticket = (project.tickets as any).id(ticketId);

        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }

    res.locals = {...res.locals, ticket};
    next();
}