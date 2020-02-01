"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ticket_model_1 = require("./ticket.model");
var ProjectType;
(function (ProjectType) {
    ProjectType["DESIGN"] = "design";
    ProjectType["PLANNING"] = "planning";
    ProjectType["REQUIREMENTS"] = "requirements";
    ProjectType["ARCHITECTURE"] = "architecture";
    ProjectType["PROTOTYPING"] = "prototyping";
    ProjectType["DEV"] = "dev";
    ProjectType["TESTING"] = "testing";
    ProjectType["PROD"] = "prod";
    ProjectType["INFRA"] = "infra";
    ProjectType["OTHER"] = "other";
})(ProjectType = exports.ProjectType || (exports.ProjectType = {}));
exports.projectTypeArr = Object.values(ProjectType);
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["OPEN"] = "open";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["FINISHED"] = "closed";
    ProjectStatus["DEFERRED"] = "deferred";
    ProjectStatus["ABORTED"] = "aborted";
})(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
exports.projectStatusArr = Object.values(ProjectStatus);
exports.projectSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: exports.projectTypeArr,
        default: ProjectType.OTHER
    },
    status: {
        type: String,
        enum: exports.projectStatusArr,
        default: ProjectStatus.OPEN
    },
    tickets: {
        type: [ticket_model_1.ticketSchema],
        default: []
    },
    assignedUsers: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
        default: []
    },
    projectLeader: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filenames: {
        type: [String],
        default: []
    },
}, {
    toJSON: {
        virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toObject: { virtuals: true },
    timestamps: true
});
exports.projectSchema.methods.removeUserFromProject = function (userId) {
    this.assignedUsers = this.assignedUsers.filter((uid) => uid + '' !== userId + '');
};
exports.projectSchema.methods.removeUserFromProjectAndSave = async function (userId) {
    this.removeUserFromProject(userId);
    await this.save();
};
exports.projectSchema.methods.addUserToProject = function (userId) {
    this.assignedUsers.push(userId);
};
exports.projectSchema.methods.addUserToProjectAndSave = async function (userId) {
    this.addUserToProject(userId);
    await this.save();
};
exports.projectSchema.methods.addProjectLeader = function (leaderId) {
    this.projectLeader = leaderId;
    this.addUserToProject(leaderId);
};
exports.projectSchema.methods.addProjectLeaderAndSave = async function (leaderId) {
    this.addProjectLeader(leaderId);
    await this.save();
};
/** exclude unused subdocs to decrease response size */
exports.projectSchema.statics.toMinimizedJSON = function (projects) {
    return projects.map((p) => {
        const numTickets = p.tickets.length;
        // exclude tickets
        p.set('tickets', []);
        return { ...p.toJSON(), numTickets };
    });
};
exports.ProjectModel = mongoose_1.default.model('Project', exports.projectSchema);
//# sourceMappingURL=project.model.js.map