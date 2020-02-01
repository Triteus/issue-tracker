"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.commentSchema.statics.toJSON = function (comments) {
    const CommentModel = mongoose_1.default.models['Comment'];
    return comments.map((comment) => {
        return new CommentModel(comment).toJSON();
    });
};
exports.commentSchema.statics.populateComments = function (comments) {
    const CommentModel = mongoose_1.default.models['Comment'];
    return CommentModel.populate(comments, { path: 'userId' });
};
exports.commentSchema.statics.populateComment = async function (comment) {
    const result = await this.populateComments([comment]);
    return result[0];
};
exports.CommentModel = mongoose_1.default.model('Comment', exports.commentSchema);
//# sourceMappingURL=comment.model.js.map