import { Request, Response, NextFunction } from "express";
import { IUser, ERole } from "../models/User";
import { isArray } from "util";
import { ResponseError, ErrorTypes } from "./error";


const message = 'Missing permissions!';

// we assume that admin can access everything

export default {
    hasRoles: function (roles: ERole[] | ERole) {
        return function (req: Request & { user: IUser }, res: Response, next: NextFunction) {
            const user = req.user;
            if (user.roles.includes(ERole.Admin)) {
                return next();
            }

            if (!isArray(roles)) {
                if (!user.roles.includes(roles)) {
                    throw new ResponseError(message, ErrorTypes.NOT_AUTHORIZED);
                }
                return next();
            }

            for (let role of roles) {
                if (!user.roles.includes(role)) {
                    throw new ResponseError(message, ErrorTypes.NOT_AUTHORIZED);
                }
            }
            return next();
        }
    },
    hasOneRole: function (roles: ERole[] | ERole) {
        return function (req: Request & { user: IUser }, res: Response, next: NextFunction) {
            const user = req.user;
            if (user.roles.includes(ERole.Admin)) {
                return next();
            }

            if (!isArray(roles)) {
                if (!user.roles.includes(roles)) {
                    throw new ResponseError(message, ErrorTypes.NOT_AUTHORIZED);
                }
                return next();
            }

            for (let role of roles) {
                if (user.roles.includes(role)) {
                    return next();
                }
            }
            throw new ResponseError(message, ErrorTypes.NOT_AUTHORIZED);
        }
    },
    isAccOwner: function () {
        return function (req: Request & { user: IUser }, res: Response, next: NextFunction) {
            const user = req.user as IUser;
            if (user.roles.includes(ERole.Admin)) {
                return next();
            }
            if (user._id.toString() === req.params.id) {
                return next();
            } else {
                throw new ResponseError(message, ErrorTypes.NOT_AUTHORIZED);
            }
        }
    },
}

