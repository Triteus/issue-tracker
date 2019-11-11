import { body, param } from "express-validator"
import { TicketStatus, ticketStatusArr, priorityArr } from "../../models/Ticket"



export const basicValidators = [
    body('title').isLength({ min: 4, max: 100 }),
    body('priority').optional().isIn(priorityArr),
    body('description').optional().isString(),
    body('affectedSystems').optional().isArray(),
    body('neededAt').optional().isISO8601(),
    body('lastEditor').not().exists(),
    body('owner').not().exists(),
    body('editors').not().exists()
]

export const TicketValidators = {
    createTicket: [
        ...basicValidators,
        body('status').optional().equals('open'),
    ],
    getTicket: [
    ],
    putTicket: [
        ...basicValidators,
        body('status').isIn(ticketStatusArr)
    ],
    deleteTicket: [
    ],
    changeStatus: [
        body('status').isIn(ticketStatusArr)
    ],
    changeSubTasks: [
        body('subTasks').isArray(),
        body('subTasks.*.description').exists().isString(),
        body('subTasks.*.isDone').exists().isBoolean()
    ]
}
