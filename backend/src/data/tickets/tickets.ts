import {ITicketDocument, TicketStatus, Priority} from "../../models/ticket.model";
import faker from 'faker';
import users from '../users/users';

let tickets: Partial<ITicketDocument>[] = [];

for(let i = 0; i < 100; i++) {
    tickets.push({
        owner: users[0]._id,
        lastEditor: users[1]._id,
        assignedTo: users[1]._id,
        editors: [users[1]._id],
        title: faker.random.words(5),
        description: faker.random.words(30),
        priority: Priority.HIGH,
        status: TicketStatus.OPEN,
        subTasks: [],
        affectedSystems: ['JIRA', 'Outlook'],
        createdAt: faker.date.recent(1),
        updatedAt: faker.date.recent(3),
        __v: 0
    });
}

export = tickets;