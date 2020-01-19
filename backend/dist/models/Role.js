"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roleSchema = new mongoose_1.default.Schema({
    name: String,
    parentId: {
        ref: 'Role',
        type: mongoose_1.default.Schema.Types.ObjectId
    }
});
exports.default = mongoose_1.default.model('Role', roleSchema);
exports.RoleSchema = roleSchema;
//# sourceMappingURL=Role.js.map