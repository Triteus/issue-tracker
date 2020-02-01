"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_model_1 = require("../models/ticket.model");
function subTasksData() {
    return [
        { description: 'subtask 1', isDone: true },
        { description: 'subtask 2', isDone: false }
    ];
}
exports.subTasksData = subTasksData;
const neededAt = new Date().toJSON();
function ticketData() {
    return {
        title: 'Something does not work',
        description: 'A sample ticket',
        status: ticket_model_1.TicketStatus.OPEN,
        priority: ticket_model_1.Priority.HIGH,
        category: ticket_model_1.TicketCategory.BUG,
        neededAt,
        affectedSystems: ['confluence', 'jira', 'outlook']
    };
}
exports.ticketData = ticketData;
function updatedTicketData() {
    return {
        title: 'updated title',
        description: 'updated description',
        priority: ticket_model_1.Priority.VERY_HIGH,
        category: ticket_model_1.TicketCategory.FEATURE,
        neededAt,
        status: ticket_model_1.TicketStatus.ACTIVE,
        subTasks: [
            { description: 'subtask 1', isDone: true },
            { description: 'subtask 2', isDone: false }
        ]
    };
}
exports.updatedTicketData = updatedTicketData;
//# sourceMappingURL=ticket.js.map