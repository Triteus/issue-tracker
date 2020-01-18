"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.validate = (req, res, next) => {
    const errors = express_validator_1.validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    //const extractedErrors = []
    //errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    return res.status(422).json({
        errors: errors.array(),
    });
};
//# sourceMappingURL=validate.js.map