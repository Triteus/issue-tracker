"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.CommentValidators = {
    postComment: [
        express_validator_1.body('message').trim().isString().isLength({ min: 4 })
    ],
    putComment: [
        express_validator_1.body('message').trim().isString().isLength({ min: 4 })
    ],
    deleteComment: [
        express_validator_1.param('commentId').isMongoId()
    ]
};
//# sourceMappingURL=comment.validate.js.map