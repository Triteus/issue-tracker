"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ticket_model_1 = require("../../models/ticket.model");
exports.basicValidators = [
    express_validator_1.body('title').isLength({ min: 4, max: 100 }),
    express_validator_1.body('category').optional().isIn(ticket_model_1.ticketCategoryArr),
    express_validator_1.body('priority').optional().isIn(ticket_model_1.priorityArr),
    express_validator_1.body('description').optional().isString(),
    express_validator_1.body('affectedSystems').optional().isArray(),
    express_validator_1.body('neededAt').optional().isISO8601(),
    express_validator_1.body('lastEditor').not().exists(),
    express_validator_1.body('owner').not().exists(),
    express_validator_1.body('editors').not().exists(),
    express_validator_1.body('filenames').optional().isArray(),
    express_validator_1.body('comments').not().exists() // comments are handled by comment-controller
];
exports.TicketValidators = {
    createTicket: [
        ...exports.basicValidators,
        express_validator_1.body('status').optional().equals('open'),
    ],
    getTicket: [],
    putTicket: [
        ...exports.basicValidators,
        express_validator_1.body('status').isIn(ticket_model_1.ticketStatusArr)
    ],
    deleteTicket: [],
    changeStatus: [
        express_validator_1.body('status').isIn(ticket_model_1.ticketStatusArr)
    ],
    changeTitle: [
        express_validator_1.body('title').isLength({ min: 4 })
    ],
    changeSubTasks: [
        express_validator_1.body('subTasks').isArray(),
        express_validator_1.body('subTasks.*.description').exists().isString(),
        express_validator_1.body('subTasks.*.isDone').exists().isBoolean()
    ]
};
//# sourceMappingURL=ticket.validate.js.map