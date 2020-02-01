"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_model_1 = require("./comment.model");
const comment_1 = require("../test-data/comment");
describe('CommentModel', () => {
    describe('JSON response (toJSON)', () => {
        it('removes _id and __v from comment', () => {
            const comment = new comment_model_1.CommentModel(comment_1.commentData());
            comment.__v = 1;
            const result = comment.toJSON();
            expect(result.__v).toBeUndefined();
            expect(result._id).toBeUndefined();
        });
        it('maps userId-field to user-field', () => {
            const comment = new comment_model_1.CommentModel(comment_1.commentData());
            const result = comment.toJSON();
            expect(result.userId).toBeUndefined();
            expect(result.user).toBeDefined();
        });
    });
});
//# sourceMappingURL=comment.model.test.js.map