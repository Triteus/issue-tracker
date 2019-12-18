import { body } from "express-validator"

export const basicValidators = [
    body('name').isLength({min: 4, max: 100}),
    body('description').optional().isLength({min: 4, max: 5000}),
    body('filenames').optional().isArray(),
    body('assignedUsers').optional().isArray(),
    body('tickets').not().exists() 
]

export const projectValidators = {
    postProject: [
        ...basicValidators
    ],
    putProject: [
        ...basicValidators
    ]
}