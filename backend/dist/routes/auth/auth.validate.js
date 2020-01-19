"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../../models/User"));
exports.validatePW = express_validator_1.body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must at least be 6 characters long');
exports.validateEmail = express_validator_1.body('email')
    .trim()
    .isEmail().withMessage('Invalid e-mail')
    .bail()
    .normalizeEmail()
    .custom(val => {
    return User_1.default.findOne({ email: val })
        .then(user => {
        if (user) {
            return Promise.reject('E-mail already in use');
        }
    });
});
exports.AuthValidators = {
    register: [
        exports.validateEmail,
        exports.validatePW,
        express_validator_1.body('firstName').exists().withMessage('First name is missing').trim(),
        express_validator_1.body('lastName').exists().withMessage('Last name is missing').trim(),
    ],
    login: [
        express_validator_1.body('email').isEmail().withMessage('Invalid e-mail').trim().normalizeEmail(),
        express_validator_1.body('password').exists().withMessage('Missing password').trim(),
    ],
    changePassword: [
        express_validator_1.body('oldPW').exists().trim(),
        express_validator_1.body('newPW').exists().bail().trim().custom((newPW, { req }) => {
            if (req.body.newPWConfirm !== newPW) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ],
    getToken: []
};
//# sourceMappingURL=auth.validate.js.map