import { body, param } from "express-validator";
import { validateEmail } from "../validators/email";
import { validatePW } from "../validators/password";


export const AuthValidation = {
    register: [
        validateEmail,
        validatePW,
        body('firstName').exists().withMessage('First name is missing').trim(),
        body('lastName').exists().withMessage('Last name is missing').trim(),
    ],
    login: [
        body('email').isEmail().withMessage('Invalid e-mail').trim().normalizeEmail(),
        body('password').exists().withMessage('Missing password').trim(),
    ],
    changePassword: [
        body('oldPW').exists().trim(),
        body('newPW').exists().bail().trim().custom((newPW, { req }) => {
            if (req.body.newPWConfirm !== newPW) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ]
}