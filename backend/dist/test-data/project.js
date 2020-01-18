"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function projectData() {
    return {
        name: 'sample project',
        description: 'Description of a project',
        assignedUsers: [],
        projectLeader: mongoose_1.default.Types.ObjectId(),
        filenames: ['file 1', 'file 2']
    };
}
exports.projectData = projectData;
function updatedProjectData() {
    return {
        ...projectData(),
        assignedUsers: [mongoose_1.default.Types.ObjectId()],
        name: 'updated project',
        description: 'updated description'
    };
}
exports.updatedProjectData = updatedProjectData;
//# sourceMappingURL=project.js.map