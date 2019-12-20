import { body } from "express-validator"
import { ticketStatusArr } from "../../../models/Ticket"
import { projectStatusArr, projectTypeArr } from "../../../models/Project"

export const basicValidators = [
    body('name').isLength({min: 4, max: 100}),
    body('description').optional().isLength({min: 4, max: 5000}),
    body('filenames').optional().isArray(),
    body('assignedUsers').optional().isArray(),
    body('tickets').not().exists(),
    body('status').optional().isIn(projectStatusArr),
    body('type').optional().isIn(projectTypeArr)
]

export const projectValidators = {
    postProject: [
        ...basicValidators
    ],
    putProject: [
        ...basicValidators
    ]
}