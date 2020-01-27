import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface ICommentDocument extends Document {
    id: Types.ObjectId;
    userId: Types.ObjectId;
    message: string;
}

export interface IComment extends ICommentDocument {

}

export interface ICommentModel extends Model<IComment> {
    toJSON(comments: IComment[]): Promise<ICommentDocument[]>,
    populateComments(comments: ICommentDocument[]): Promise<ICommentDocument[]>,
    populateComment(comment: ICommentDocument): Promise<ICommentDocument>
}

export const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id;
            ret.user = ret.userId;
            delete ret.userId;
        }
    },
    toObject: { virtuals: true },
    timestamps: true
});

commentSchema.statics.toJSON = function (comments: ICommentDocument[]) {
    const CommentModel = mongoose.models['Comment'];
    return comments.map((comment) => {
      return new CommentModel(comment).toJSON();
    });
  }

commentSchema.statics.populateComments = function (comments: ICommentDocument[]): Promise<ICommentDocument[]> {
    const CommentModel = mongoose.models['Comment'];
    return CommentModel.populate(comments, {path: 'userId'});
}

commentSchema.statics.populateComment = async function (comment: ICommentDocument): Promise<ICommentDocument> {
    const result = await this.populateComments([comment]);
    return result[0];
}


export const CommentModel =  mongoose.model<IComment, ICommentModel>('Comment', commentSchema);