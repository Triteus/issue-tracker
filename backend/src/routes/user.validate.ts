import { validateEmailOptional } from "../validators/email";
import { body } from "express-validator";


export const UserValidation = {
    change: [
        validateEmailOptional,
        body('firstName').trim(),
        body('lastName').trim(),
        body('password').not().exists(),
        body('id').not().exists(),
        body('_id').not().exists(),
        body('createdAt').not().exists(),
        body('updatedAt').not().exists(),
    ]
}