"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.validateEmailOptional = express_validator_1.body('email')
    .if(express_validator_1.body('email').exists())
    .trim()
    .isEmail().withMessage('Invalid e-mail')
    .bail()
    .normalizeEmail();
exports.UserValidators = {
    change: [
        exports.validateEmailOptional,
        express_validator_1.body('firstName').optional().trim(),
        express_validator_1.body('lastName').optional().trim(),
        express_validator_1.body('password').not().exists(),
        express_validator_1.body('id').not().exists(),
        express_validator_1.body('_id').not().exists(),
        express_validator_1.body('createdAt').not().exists(),
        express_validator_1.body('updatedAt').not().exists(),
    ]
};
//# sourceMappingURL=user.validate.js.map