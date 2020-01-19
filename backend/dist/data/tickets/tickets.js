"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Ticket_1 = require("../../models/Ticket");
const faker_1 = __importDefault(require("faker"));
const users_1 = __importDefault(require("../users/users"));
let tickets = [];
for (let i = 0; i < 100; i++) {
    tickets.push({
        owner: users_1.default[0]._id,
        lastEditor: users_1.default[1]._id,
        assignedTo: users_1.default[1]._id,
        editors: [users_1.default[1]._id],
        title: faker_1.default.random.words(5),
        description: faker_1.default.random.words(30),
        priority: Ticket_1.Priority.HIGH,
        status: Ticket_1.TicketStatus.OPEN,
        subTasks: [],
        affectedSystems: ['JIRA', 'Outlook'],
        createdAt: faker_1.default.date.recent(1),
        updatedAt: faker_1.default.date.recent(3),
        __v: 0
    });
}
module.exports = tickets;
//# sourceMappingURL=tickets.js.map