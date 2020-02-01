"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_model_1 = require("../models/project.model");
const error_1 = require("./error");
async function findProject(req, res, next) {
    const projectId = req.params.projectId;
    const project = await project_model_1.ProjectModel.findById(projectId);
    if (!project) {
        next(new error_1.ResponseError('Project not found!', error_1.ErrorTypes.NOT_FOUND));
    }
    res.locals = { ...res.locals, project };
    next();
}
exports.findProject = findProject;
;
//# sourceMappingURL=project.js.map