import { body, validationResult } from 'express-validator';


export const validatePW = body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must at least be 6 characters long');