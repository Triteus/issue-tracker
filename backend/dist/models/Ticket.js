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
const SubTask_1 = require("./SubTask");
const Comment_1 = require("./Comment");
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["OPEN"] = "open";
    TicketStatus["CLOSED"] = "closed";
    TicketStatus["ACTIVE"] = "active";
})(TicketStatus = exports.TicketStatus || (exports.TicketStatus = {}));
exports.ticketStatusArr = Object.values(TicketStatus);
var TicketCategory;
(function (TicketCategory) {
    TicketCategory["BUG"] = "bug";
    TicketCategory["FEATURE"] = "feature";
    TicketCategory["REQUEST"] = "request";
    TicketCategory["SUGGESTION"] = "suggestion";
    TicketCategory["INFO"] = "info";
    TicketCategory["OTHER"] = "other";
})(TicketCategory = exports.TicketCategory || (exports.TicketCategory = {}));
exports.ticketCategoryArr = Object.values(TicketCategory);
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MODERATE"] = "moderate";
    Priority["HIGH"] = "high";
    Priority["VERY_HIGH"] = "very high";
})(Priority = exports.Priority || (exports.Priority = {}));
exports.priorityArr = Object.values(Priority);
exports.ticketHistorySchema = new mongoose_1.default.Schema({
    editorId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    editedAt: Date,
    changedPaths: [{ path: String, oldValue: mongoose_1.Schema.Types.Mixed, newValue: mongoose_1.Schema.Types.Mixed }]
});
exports.ticketSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        immutable: true
    },
    editors: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            default: []
        }],
    editorHistory: {
        type: [exports.ticketHistorySchema],
        default: []
    },
    lastEditor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    priority: {
        type: String,
        enum: exports.priorityArr,
        default: Priority.LOW
    },
    neededAt: {
        type: Date,
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: exports.ticketStatusArr,
        default: TicketStatus.OPEN
    },
    category: {
        type: String,
        enum: exports.ticketCategoryArr,
        default: TicketCategory.OTHER
    },
    subTasks: {
        type: [SubTask_1.subTaskSchema],
        default: []
    },
    affectedSystems: {
        type: [{ type: String, lowercase: true }],
        default: [],
    },
    filenames: {
        type: [String],
        default: []
    },
    comments: {
        type: [Comment_1.commentSchema],
        default: []
    }
}, {
    toJSON: {
        virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id;
            ret.editorHistory = ret.editorHistory.map((hist) => {
                const editor = hist.editorId;
                delete hist.editorId;
                return { ...hist, editor };
            });
            if (ret.neededAt) {
                ret.neededAt = ret.neededAt.toJSON();
            }
        }
    },
    toObject: { virtuals: true },
    timestamps: true
});
exports.ticketSchema.methods.setSubTasks = function (subTasks, editorId) {
    if (!subTasks)
        return;
    this.subTasks = subTasks;
};
exports.ticketSchema.methods.setEditor = function (editorId) {
    this.lastEditor = editorId;
    this.editors.push(editorId);
};
exports.ticketSchema.methods.setEditorAndSave = async function (editorId) {
    this.setEditor(editorId);
    return this.save();
};
exports.ticketSchema.methods.changeStatus = function (status, editorId) {
    if (status === this.status) {
        return;
    }
    if (status === TicketStatus.CLOSED || status === TicketStatus.OPEN) {
        this.assignedTo = null;
    }
    else {
        this.assignedTo = mongoose_1.default.Types.ObjectId(editorId.toString());
    }
    this.status = status;
};
exports.ticketSchema.methods.addEditorHistory = function (history) {
    this.editorHistory.push(history);
};
exports.ticketSchema.methods.addEditorHistoryAndSave = async function (history) {
    this.addHistory(history);
    return this.save();
};
exports.ticketSchema.statics.toJSON = function (tickets) {
    const TicketModel = mongoose_1.default.models['Ticket'];
    return tickets.map((ticket) => {
        return new TicketModel(ticket).toJSON();
    });
};
exports.ticketSchema.statics.populateTickets = async function (tickets) {
    const TicketModel = mongoose_1.default.models['Ticket'];
    return TicketModel.populate(tickets, { path: 'owner assignedto lastEditor' });
};
exports.ticketSchema.virtual("id").get(function () {
    return this._id;
});
exports.default = mongoose_1.default.model('Ticket', exports.ticketSchema);
//# sourceMappingURL=Ticket.js.map