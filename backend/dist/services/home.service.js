"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Project_1 = require("../models/Project");
const Ticket_1 = require("../models/Ticket");
const moment_1 = __importDefault(require("moment"));
class HomeService {
    async findLastTickets(numTickets, userId) {
        const match = {
            $or: [
                { 'tickets.editors': { $in: [userId] } },
                { 'tickets.owner': userId }
            ]
        };
        const projection = {};
        Ticket_1.ticketSchema.eachPath((path) => {
            projection[path] = `$tickets.${path}`;
        });
        return await Project_1.ProjectModel.aggregate([
            { $match: match },
            { $unwind: '$tickets' },
            { $match: match },
            { $sort: { 'tickets.updatedAt': -1 } },
            { $limit: numTickets },
            { $project: { ...projection, projectId: '$_id' } }
        ]);
    }
    async countTicketsCreatedLastMonth() {
        const timeLastMonth = moment_1.default().subtract(1, 'months').toDate();
        const result = await Project_1.ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $match: { 'tickets.createdAt': { $gte: timeLastMonth } } },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }
    async countTicketsCreatedLastWeek() {
        const timeLastWeek = moment_1.default().subtract(1, 'weeks').toDate();
        const result = await Project_1.ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $match: { 'tickets.createdAt': { $gte: timeLastWeek } } },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }
}
exports.HomeService = HomeService;
//# sourceMappingURL=home.service.js.map