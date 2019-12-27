import { Controller, Post, Get, Delete, Put, Children, Middleware, Patch } from "@overnightjs/core";
import { ProjectModel } from "../../../models/Project";
import { Request, Response, NextFunction } from "express";
import { ResponseError, ErrorTypes } from "../../../middlewares/error";
import { TicketController } from "../../ticket/ticket";
import passport from "passport";
import { projectValidators } from "./project.validate";
import { validation } from "../../../middlewares/validation";
import { IUser, RequestWithUser } from "../../../models/User";
import { Types } from "mongoose";


const validate = validation(projectValidators);

@Controller('api/v2/project')
@Children([
    new TicketController()
])
export class ProjectController {

    @Get()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async getProjects(req: Request, res: Response) {
        const projects = await ProjectModel.find({});
        return res.status(200).send({projects});
    }

    @Get(':projectId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async getProject(req: Request, res: Response) {
        const project = await ProjectModel.findById(req.params.projectId).populate('assignedUsers');
        if(!project) {
            throw new ResponseError('Project was not found!', ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({project});
    }

    @Get(':projectId/name')
    @Middleware([
        passport.authenticate('jwt', {session: false})
    ])
    private async getProjectName(req: Request, res: Response) {
        const project = await ProjectModel.findById(req.params.projectId);
        if(!project) {
            throw new ResponseError('Project was not found!', ErrorTypes.NOT_FOUND);
        }

        return res.status(200).send({projectName: project.name});
    }

    // NOTE: Only returns id of users
    @Get(':projectId/assignedUsers')
    @Middleware([
        passport.authenticate('jwt', {session: false})
    ])
    private async getAssignedUsers(req: Request, res: Response) {
        const project = await ProjectModel.findById(req.params.projectId);
        if(!project) {
            throw new ResponseError('Project was not found!', ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({assignedUsers: project.assignedUsers});
    } 

    @Post()
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('postProject')
    ])
    private async postProject(req: RequestWithUser, res: Response) {
        // no initial tickets
        const {id, tickets, ...payload} = req.body;
        payload.projectLeader = Types.ObjectId();
        let project = new ProjectModel(payload);
        await project.addProjectLeaderAndSave(req.user._id);
        
        return res.status(201).send({message: 'Project created successfully!', project});
    }

    @Put(':projectId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('putProject')
    ])
    private async putProject(req: RequestWithUser, res: Response) {
        // make sure to exclude tickets since they are handled separately
        const {id, tickets, ...payload} = req.body;
        const project = await ProjectModel.findById(req.params.projectId);
        if(!project) {
            throw new ResponseError('Project was not found!', ErrorTypes.NOT_FOUND);
        }

        if (!project.projectLeader.equals(req.user._id)) {
            throw new ResponseError('Missing persmission to update project.', ErrorTypes.NOT_AUTHORIZED);
        }

        project.set(payload);
        // check if users are populated since only ids are saved in "assignedUsers" path
        if (payload.assignedUsers && payload.assignedUsers[0] && payload.assignedUsers[0].username) {
            // map to id of users and assign to project
            project.assignedUsers = payload.assignedUsers.map(u => u.id);
        }
        const updatedProject = await project.save();
        
        return res.status(200).send({message: 'Project successfully updated', updatedProject})
    }

    @Patch(':projectId/assignedUsers')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
        ...validate('patchAssignedUsers')
    ])
    private async patchAssignedUsers(req: Request, res: Response) {
        const project = await ProjectModel.findById(req.params.projectId);
        if(!project) {
            throw new ResponseError('Project not found!', ErrorTypes.NOT_FOUND);
        }

        project.set({assignedUsers: req.body.assignedUsers});
        const updatedProject = await project.save();

        return res.status(200).send({message: 'Assigned users successfully changed!', updatedProject});
    }
    

    @Delete(':projectId')
    @Middleware([
        passport.authenticate('jwt', { session: false }),
    ])
    private async deleteProject(req: RequestWithUser, res: Response) {
        const project = await ProjectModel.findById(req.params.projectId);
        if(!project) {
            throw new ResponseError('Project not found!', ErrorTypes.NOT_FOUND);
        }

        if (!project.projectLeader.equals(req.user._id)) {
            throw new ResponseError('Missing persmission to delete project.', ErrorTypes.NOT_AUTHORIZED);
        }

        const deletedProject = await project.remove();

        return res.status(200).send({message: 'Project successfully deleted!', deletedProject});
    }



}