import { body } from "express-validator";


export const validateEmailOptional = body('email')
    .if(body('email').exists())
    .trim()
    .isEmail().withMessage('Invalid e-mail')
    .bail()
    .normalizeEmail();


export const UserValidators = {
    change: [
        validateEmailOptional,
        body('firstName').optional().trim(),
        body('lastName').optional().trim(),
        body('password').not().exists(),
        body('id').not().exists(),
        body('_id').not().exists(),
        body('createdAt').not().exists(),
        body('updatedAt').not().exists(),
    ]
}