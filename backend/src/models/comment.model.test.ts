import { CommentModel } from "./Comment";
import { commentData } from "../test-data/comment";

describe('CommentModel', () => {
    describe('JSON response (toJSON)', () => {
        it('removes _id and __v from comment', () => {
            const comment = new CommentModel(commentData());
            comment.__v = 1;
            const result = comment.toJSON();
            expect(result.__v).toBeUndefined();
            expect(result._id).toBeUndefined();
        })

        it('maps userId-field to user-field', () => {
            const comment = new CommentModel(commentData());
            const result = comment.toJSON();
            expect(result.userId).toBeUndefined();
            expect(result.user).toBeDefined();
        })

    })
});