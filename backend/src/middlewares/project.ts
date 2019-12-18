import { RequestWithUser } from "../models/User";
import { Response, NextFunction } from "express";
import { ProjectModel } from "../models/Project";
import { ResponseError, ErrorTypes } from "./error";

export async function findProject(req: RequestWithUser, res: Response, next: NextFunction) {
    const projectId = req.params.projectId;
    
    const project = await ProjectModel.findById(projectId);
    if(!project) {
        next(new ResponseError('Project not found!', ErrorTypes.NOT_FOUND));
    }

    res.locals = {project};
    next();
};