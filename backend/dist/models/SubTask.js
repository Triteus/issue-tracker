"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.subTaskSchema = new mongoose_1.Schema({
    description: {
        required: true,
        type: String
    },
    isDone: {
        type: Boolean,
        default: false
    },
});
exports.SubTaskModel = mongoose_1.model('SubTask', exports.subTaskSchema);
//# sourceMappingURL=SubTask.js.map