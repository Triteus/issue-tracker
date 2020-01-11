import { CommentController } from "./comment";
import { CommentValidators } from "./comment.validate";
import { validateBody, checkResponse, validateBodyAndParams } from "../../../validators/test-util";
import { Types } from "mongoose";


describe('Comment-controller-validators', () => {

    describe('POST /:ticketId/comment', () => {
        const validators = CommentValidators.postComment;

        it('throws (length < 4)', async () => {
            const errors = await validateBody({message: 'a'}, validators);
            checkResponse(errors, 'message', 'Invalid value');
        })

        it('passes', async () => {
            const errors = await validateBody({message: 'valid comment'}, validators);
            expect(errors.length).toBe(0);
        })
    })
    
    describe('PUT /:ticketId/comment/:commentId', () => {
        const validators = CommentValidators.putComment;

        it('throws (length < 4)', async () => {
            const errors = await validateBody({message: 'a'}, validators);
            checkResponse(errors, 'message', 'Invalid value');
        })

        it('passes', async () => {
            const errors = await validateBody({message: 'valid comment'}, validators);
            expect(errors.length).toBe(0);
        })
    })
    
    describe('DELETE /:ticketId/comment/:commentId', () => {
        const validators = CommentValidators.deleteComment;
        
        it('throws (commentId not objectId)', async () => {
            const errors = await validateBodyAndParams({}, {commentId: 'invalid objectId'}, validators);
            checkResponse(errors, 'commentId', 'Invalid value');
        })

        it('passes', async () => {
            const errors = await validateBodyAndParams({}, {commentId: Types.ObjectId()}, validators);
            expect(errors.length).toBe(0);
        })
    })
})