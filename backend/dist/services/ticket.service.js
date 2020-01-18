"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Ticket_1 = __importStar(require("../models/Ticket"));
const error_1 = require("../middlewares/error");
const mongoose_2 = __importDefault(require("mongoose"));
const Project_1 = require("../models/Project");
const ticket_service_util_1 = require("./ticket.service.util");
const array_1 = require("../util/array");
const pagination_service_1 = require("./pagination.service");
const sort_service_1 = require("./sort.service");
class TicketService {
    async findTicketAndAddHistoryEntry(project, ticketId, editorId, payload) {
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        const history = this.createEditorHistoryEntry(ticket, editorId, payload);
        if (history.changedPaths.length > 0) {
            return ticket.addEditorHistoryAndSave(history);
        }
        return ticket;
    }
    addHistoryEntry(ticket, editorId, payload) {
        const history = this.createEditorHistoryEntry(ticket, editorId, payload);
        if (history.changedPaths.length > 0) {
            ticket.addEditorHistory(history);
        }
        return ticket;
    }
    createEditorHistoryEntry(ticket, editorId, payload) {
        const keys = ['status', 'type', 'assignedTo', 'priority', 'title', 'description'];
        const arrayKeys = ['affectedSystems', 'filenames'];
        const date = new Date();
        let history = { editorId, editedAt: date, changedPaths: [] };
        for (let path of keys) {
            if (payload[path] && payload[path] !== ticket[path]) {
                history.changedPaths.push({ path, oldValue: ticket[path], newValue: payload[path] });
            }
        }
        for (let path of arrayKeys) {
            if (payload[path] && !array_1.arrayEquals(payload[path], ticket[path])) {
                history.changedPaths.push({
                    path: path,
                    oldValue: ticket[path],
                    newValue: payload[path]
                });
            }
        }
        //TODO handle history of subtasks
        return history;
    }
    async findAndUpdateTicket(project, ticketId, editorId, payload) {
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.updateTicket(ticket, editorId, payload);
        await project.save();
        return ticket;
    }
    updateTicket(ticket, editorId, payload) {
        const { status, subTasks, ...ticketPayload } = payload;
        // update paths
        ticket.set(payload);
        ticket.setSubTasks(payload.subTasks, mongoose_1.Types.ObjectId(editorId.toString()));
        ticket.changeStatus(status, mongoose_1.Types.ObjectId(editorId.toString()));
        ticket.setEditor(editorId);
        return ticket;
    }
    async createAndSaveTicket(project, ownerId, payload) {
        const ticket = this.createTicket(ownerId, payload);
        project.tickets.push(ticket);
        await project.save();
        return ticket;
    }
    createTicket(ownerId, payload) {
        return new Ticket_1.default({ ...payload, owner: ownerId });
    }
    async findAndDeleteTicket(project, ticketId) {
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        ticket.remove();
        await project.save();
        return ticket;
    }
    async findTicketAndChangeStatus(project, status, ticketId, editorId) {
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.changeStatus(ticket, status, editorId);
        await project.save();
        return ticket;
    }
    changeStatus(ticket, status, editorId) {
        ticket.changeStatus(status, mongoose_1.Types.ObjectId(editorId.toString()));
        ticket.setEditor(editorId);
        return ticket;
    }
    async findTicketAndChangeSubTasks(project, ticketId, subTasks, editorId) {
        const ticket = project.tickets.id(ticketId);
        if (!ticket) {
            throw new error_1.ResponseError('Ticket not found!', error_1.ErrorTypes.NOT_FOUND);
        }
        this.changeSubTasks(ticket, subTasks, editorId);
        await project.save();
        return ticket;
    }
    async changeSubTasks(ticket, subTasks, editorId) {
        const id = mongoose_2.default.Types.ObjectId(editorId.toString());
        ticket.setSubTasks(subTasks, id);
        ticket.setEditor(editorId);
        return ticket;
    }
    async getTickets(project, match = {}, sort = {}, pagination = {}) {
        // make sure to only aggregate on specific project
        match = ticket_service_util_1.withProjectId(match, project._id);
        const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
        const result = await Project_1.ProjectModel
            .aggregate(stages);
        const tickets = await Ticket_1.default.populateTickets(result);
        return tickets;
    }
    async groupTicketsByStatus(project, pagination = { skip: 0, limit: Number.MAX_SAFE_INTEGER }, match = {}, sort = {}) {
        // make sure to only aggregate on specific project
        match = ticket_service_util_1.withProjectId(match, project._id);
        const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
        const result = await Project_1.ProjectModel.aggregate(stages);
        const tickets = await Ticket_1.default.populateTickets(result);
        //TODO do this while aggregating (group)
        const openTickets = [], activeTickets = [], closedTickets = [];
        for (let ticket of tickets) {
            if (ticket.status === Ticket_1.TicketStatus.OPEN) {
                openTickets.push(ticket);
            }
            else if (ticket.status === Ticket_1.TicketStatus.ACTIVE) {
                activeTickets.push(ticket);
            }
            else if (ticket.status === Ticket_1.TicketStatus.CLOSED) {
                closedTickets.push(ticket);
            }
        }
        return { openTickets, activeTickets, closedTickets };
    }
    generateQueryObjects(query) {
        return {
            options: pagination_service_1.PaginationService.preparePagination(query),
            sort: ticket_service_util_1.remapObject(sort_service_1.SortService.prepareSort(query), 'tickets'),
            match: ticket_service_util_1.remapObject(ticket_service_util_1.filter(query), 'tickets')
        };
    }
    async countTickets(project, match = {}) {
        // make sure to only aggregate on specific project
        match = ticket_service_util_1.withProjectId(match, project._id);
        const result = await Project_1.ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $match: match },
            { $count: 'numTickets' }
        ]);
        return result && result[0] ? result[0].numTickets : 0;
    }
}
exports.TicketService = TicketService;
//# sourceMappingURL=ticket.service.js.map