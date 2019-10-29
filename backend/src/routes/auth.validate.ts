import { validate } from "../validators/validate";
import { body, param } from "express-validator";
import { validateEmail } from "../validators/email";
import { validatePW } from "../validators/password";


export const AuthValidation = {
    register: [
        validateEmail,
        validatePW,
        body('firstName').exists().withMessage('First name is missing').trim(),
        body('lastName').exists().withMessage('Last name is missing').trim(),
        validate
    ],
    login: [
        body('email').isEmail().withMessage('Invalid e-mail').trim().normalizeEmail(),
        body('password').exists().withMessage('Missing password').trim(),
        validate
    ],
    changePassword: [
        param('id').exists(),
        body('oldPW').exists().trim(),
        body('newPW').exists().trim(),
        body('newPWConfirm').exists().trim().custom((pwConfirm, { req }) => {
            if (req.body.newPW !== pwConfirm) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        validate
    ]
}