"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ticket_1 = require("../models/Ticket");
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
        status: Ticket_1.TicketStatus.OPEN,
        priority: Ticket_1.Priority.HIGH,
        category: Ticket_1.TicketCategory.BUG,
        neededAt,
        affectedSystems: ['confluence', 'jira', 'outlook']
    };
}
exports.ticketData = ticketData;
function updatedTicketData() {
    return {
        title: 'updated title',
        description: 'updated description',
        priority: Ticket_1.Priority.VERY_HIGH,
        category: Ticket_1.TicketCategory.FEATURE,
        neededAt,
        status: Ticket_1.TicketStatus.ACTIVE,
        subTasks: [
            { description: 'subtask 1', isDone: true },
            { description: 'subtask 2', isDone: false }
        ]
    };
}
exports.updatedTicketData = updatedTicketData;
//# sourceMappingURL=ticket.js.map