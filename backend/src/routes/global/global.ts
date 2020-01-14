import { Controller, Post, Put, Delete, Patch, Middleware } from "@overnightjs/core";
import { RequestWithUser, ERole } from "../../models/User";
import { NextFunction, Response, request, Request } from "express";
import { ResponseError, ErrorTypes } from "../../middlewares/error";
import passport from "passport";


function excludeRoutes(routes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        for (let route of routes) {
            if (req.originalUrl.includes(route)) {
                res.locals.routeExcluded = true;
                return next();
            }
        }
        passport.authenticate('jwt', { session: false })(req, res, () => {
            next();
        });
    }
}


@Controller('api/*')
export class GlobalController {

    @Post()
    @Middleware([
        excludeRoutes(['login', 'register'])
    ])

    private async postAction(req: RequestWithUser, res: Response, next: NextFunction) {
        if (res.locals.routeExcluded) {
            return next()
        }
        const roles = req.user.roles;
        if (roles.includes(ERole.Visitor)) {
            throw new ResponseError('Visitors cannot create any resources', ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }

    @Put()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async putAction(req: RequestWithUser, res: Response, next: NextFunction) {
        const roles = req.user.roles;
        if (roles.includes(ERole.Visitor)) {
            throw new ResponseError('Visitors cannot update any resources', ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }

    @Patch()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async patchAction(req: RequestWithUser, res: Response, next: NextFunction) {
        const roles = req.user.roles;
        if (roles.includes(ERole.Visitor)) {
            throw new ResponseError('Visitors cannot update any resources', ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }

    @Delete()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async deleteAction(req: RequestWithUser, res: Response, next: NextFunction) {
        const roles = req.user.roles;
        if (roles.includes(ERole.Visitor)) {
            throw new ResponseError('Visitors cannot delete any resources', ErrorTypes.NOT_AUTHORIZED);
        }
        next();
    }


}