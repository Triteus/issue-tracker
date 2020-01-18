"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../models/Project");
class ProjectService {
    findProjectsByAssignedUser(userId) {
        return Project_1.ProjectModel.find({ assignedUsers: { $in: [userId] } });
    }
    async countAllTickets() {
        const result = await Project_1.ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map