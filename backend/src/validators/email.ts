
import { body, validationResult } from 'express-validator';
import UserModel from '../models/User';

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


/**  */

export const validateEmailOptional = body('email')
    .if(body('email').exists())
    .trim()
    .isEmail().withMessage('Invalid e-mail')
    .bail()
    .normalizeEmail();
