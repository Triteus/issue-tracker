import { Priority, TicketStatus } from "../models/Ticket";


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
        priority: Priority.HIGH,
        neededAt,
        affectedSystems: ['Confluence', 'JIRA', 'Outlook']
    }
}

export function updatedTicketData() {
    return {
        title: 'updated title',
        description: 'updated description',
        priority: Priority.VERY_HIGH,
        neededAt,
        status: TicketStatus.ACTIVE,
        subTasks: [
            { description: 'subtask 1', isDone: true },
            { description: 'subtask 2', isDone: false }
        ]
    }

}