import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface ICommentDocument extends Document {
    id: Types.ObjectId;
    userId: Types.ObjectId;
    message: string;
}

export interface IComment extends ICommentDocument {

}

export interface ICommentModel extends Model<IComment> {
    
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
        }
    },
    toObject: { virtuals: true },
    timestamps: true
});

export const CommentModel =  mongoose.model<IComment, ICommentModel>('Comment', commentSchema);