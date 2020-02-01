"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_model_1 = require("../models/project.model");
class ProjectService {
    findProjectsByAssignedUser(userId) {
        return project_model_1.ProjectModel.find({ assignedUsers: { $in: [userId] } });
    }
    async countAllTickets() {
        const result = await project_model_1.ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map