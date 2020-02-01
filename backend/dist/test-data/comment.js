"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
function commentData() {
    return {
        message: 'a test comment',
        userId: mongoose_1.Types.ObjectId()
    };
}
exports.commentData = commentData;
//# sourceMappingURL=comment.js.map