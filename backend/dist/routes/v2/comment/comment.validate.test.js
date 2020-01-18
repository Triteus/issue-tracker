"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_validate_1 = require("./comment.validate");
const test_util_1 = require("../../../validators/test-util");
const mongoose_1 = require("mongoose");
describe('Comment-controller-validators', () => {
    describe('POST /:ticketId/comment', () => {
        const validators = comment_validate_1.CommentValidators.postComment;
        it('throws (length < 4)', async () => {
            const errors = await test_util_1.validateBody({ message: 'a' }, validators);
            test_util_1.checkResponse(errors, 'message', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBody({ message: 'valid comment' }, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('PUT /:ticketId/comment/:commentId', () => {
        const validators = comment_validate_1.CommentValidators.putComment;
        it('throws (length < 4)', async () => {
            const errors = await test_util_1.validateBody({ message: 'a' }, validators);
            test_util_1.checkResponse(errors, 'message', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBody({ message: 'valid comment' }, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('DELETE /:ticketId/comment/:commentId', () => {
        const validators = comment_validate_1.CommentValidators.deleteComment;
        it('throws (commentId not objectId)', async () => {
            const errors = await test_util_1.validateBodyAndParams({}, { commentId: 'invalid objectId' }, validators);
            test_util_1.checkResponse(errors, 'commentId', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBodyAndParams({}, { commentId: mongoose_1.Types.ObjectId() }, validators);
            expect(errors.length).toBe(0);
        });
    });
});
//# sourceMappingURL=comment.validate.test.js.map