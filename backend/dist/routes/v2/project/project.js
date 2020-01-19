"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@overnightjs/core");
const Project_1 = require("../../../models/Project");
const error_1 = require("../../../middlewares/error");
const ticket_1 = require("../../ticket/ticket");
const passport_1 = __importDefault(require("passport"));
const project_validate_1 = require("./project.validate");
const validation_1 = require("../../../middlewares/validation");
const mongoose_1 = require("mongoose");
const validate = validation_1.validation(project_validate_1.projectValidators);
let ProjectController = class ProjectController {
    async getProjects(req, res) {
        const projects = await Project_1.ProjectModel.find({});
        return res.status(200).send({ projects });
    }
    async getProject(req, res) {
        const project = await Project_1.ProjectModel.findById(req.params.projectId).populate('assignedUsers projectLeader');
        if (!project) {
            throw new error_1.ResponseError('Project was not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({ project });
    }
    async getProjectName(req, res) {
        const project = await Project_1.ProjectModel.findById(req.params.projectId);
        if (!project) {
            throw new error_1.ResponseError('Project was not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({ projectName: project.name });
    }
    // NOTE: Only returns id of users
    async getAssignedUsers(req, res) {
        const project = await Project_1.ProjectModel.findById(req.params.projectId);
        if (!project) {
            throw new error_1.ResponseError('Project was not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        return res.status(200).send({ assignedUsers: project.assignedUsers });
    }
    async postProject(req, res) {
        // no initial tickets
        const { id, tickets, ...payload } = req.body;
        payload.projectLeader = mongoose_1.Types.ObjectId();
        let project = new Project_1.ProjectModel(payload);
        await project.addProjectLeaderAndSave(req.user._id);
        return res.status(201).send({ message: 'Project created successfully!', project });
    }
    async putProject(req, res) {
        // make sure to exclude tickets since they are handled separately
        const { id, tickets, ...payload } = req.body;
        const project = await Project_1.ProjectModel.findById(req.params.projectId);
        if (!project) {
            throw new error_1.ResponseError('Project was not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        if (!project.projectLeader.equals(req.user._id)) {
            throw new error_1.ResponseError('Missing persmission to update project.', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        project.set(payload);
        // check if users are populated since only ids are saved in "assignedUsers" path
        if (payload.assignedUsers && payload.assignedUsers[0] && payload.assignedUsers[0].username) {
            // map to id of users and assign to project
            project.assignedUsers = payload.assignedUsers.map(u => u.id);
        }
        const updatedProject = await project.save();
        return res.status(200).send({ message: 'Project successfully updated', updatedProject });
    }
    async patchAssignedUsers(req, res) {
        const project = await Project_1.ProjectModel.findById(req.params.projectId);
        if (!project) {
            throw new error_1.ResponseError('Project not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        if (!project.projectLeader.equals(req.user._id)) {
            throw new error_1.ResponseError('Missing persmission to update project.', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        project.set({ assignedUsers: req.body.assignedUsers });
        const updatedProject = await project.save();
        return res.status(200).send({ message: 'Assigned users successfully changed!', updatedProject });
    }
    async deleteProject(req, res) {
        const project = await Project_1.ProjectModel.findById(req.params.projectId);
        if (!project) {
            throw new error_1.ResponseError('Project not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        if (!project.projectLeader.equals(req.user._id)) {
            throw new error_1.ResponseError('Missing persmission to delete project.', error_1.ErrorTypes.NOT_AUTHORIZED);
        }
        const deletedProject = await project.remove();
        return res.status(200).send({ message: 'Project successfully deleted!', deletedProject });
    }
};
__decorate([
    core_1.Get(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], ProjectController.prototype, "getProjects", null);
__decorate([
    core_1.Get(':projectId'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], ProjectController.prototype, "getProject", null);
__decorate([
    core_1.Get(':projectId/name'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false })
    ])
], ProjectController.prototype, "getProjectName", null);
__decorate([
    core_1.Get(':projectId/assignedUsers'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false })
    ])
], ProjectController.prototype, "getAssignedUsers", null);
__decorate([
    core_1.Post(),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('postProject')
    ])
], ProjectController.prototype, "postProject", null);
__decorate([
    core_1.Put(':projectId'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('putProject')
    ])
], ProjectController.prototype, "putProject", null);
__decorate([
    core_1.Patch(':projectId/assignedUsers'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
        ...validate('patchAssignedUsers')
    ])
], ProjectController.prototype, "patchAssignedUsers", null);
__decorate([
    core_1.Delete(':projectId'),
    core_1.Middleware([
        passport_1.default.authenticate('jwt', { session: false }),
    ])
], ProjectController.prototype, "deleteProject", null);
ProjectController = __decorate([
    core_1.Controller('api/v2/project'),
    core_1.Children([
        new ticket_1.TicketController()
    ])
], ProjectController);
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.js.map