import { body, param } from "express-validator";
import UserModel from '../../models/User';

export const validatePW = body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must at least be 6 characters long');


    export const validateEmail = body('email')
        .trim()
        .isEmail().withMessage('Invalid e-mail')
        .bail()
        .normalizeEmail()
        .custom(val => {
            return UserModel.findOne({ email: val })
                .then(user => {
                    if (user) {
                        return Promise.reject('E-mail already in use');
                    }
                });
        });


export const AuthValidators = {
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