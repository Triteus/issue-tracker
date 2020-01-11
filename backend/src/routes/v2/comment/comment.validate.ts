import { body, param } from "express-validator";

export const CommentValidators = {
    postComment: [
        body('message').trim().isString().isLength({min: 4})
    ],
    putComment: [
        body('message').trim().isString().isLength({min: 4})
    ],
    deleteComment: [
        param('commentId').isMongoId()
    ]
}