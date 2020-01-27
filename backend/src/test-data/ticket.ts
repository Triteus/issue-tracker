import { Priority, TicketStatus, TicketCategory } from "../models/ticket.model";


export function subTasksData() {
    return [
        { description: 'subtask 1', isDone: true },
        { description: 'subtask 2', isDone: false }
    ];
}


const neededAt = new Date().toJSON();

export function ticketData() {
    return {
        title: 'Something does not work',
        description: 'A sample ticket',
        status: TicketStatus.OPEN,
        priority: Priority.HIGH,
        category: TicketCategory.BUG,
        neededAt,
        affectedSystems: ['confluence', 'jira', 'outlook']
    }
}

export function updatedTicketData() {
    return {
        title: 'updated title',
        description: 'updated description',
        priority: Priority.VERY_HIGH,
        category: TicketCategory.FEATURE,
        neededAt,
        status: TicketStatus.ACTIVE,
        subTasks: [
            { description: 'subtask 1', isDone: true },
            { description: 'subtask 2', isDone: false }
        ]
    }

}