import { RequestWithUser } from "../models/User";
import { Response, NextFunction } from "express";
import { ProjectModel, IProject } from "../models/Project";
import { ResponseError, ErrorTypes } from "./error";


export interface ResponseWithProject extends Response {
    locals: {
        project: IProject,
        [key: string]: any
    }
}


export async function findProject(req: RequestWithUser, res: Response, next: NextFunction) {
    const projectId = req.params.projectId;
    
    const project = await ProjectModel.findById(projectId);
    if(!project) {
        next(new ResponseError('Project not found!', ErrorTypes.NOT_FOUND));
    }

    res.locals = {...res.locals, project};
    next();
};