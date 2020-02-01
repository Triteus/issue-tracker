"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importStar(require("../models/user.model"));
const visitorData = {
    email: 'randomvisitor@mail.com',
    firstName: 'random',
    lastName: 'visitor',
    password: 'visitor',
    roles: [user_model_1.ERole.Visitor]
};
async function createVisitorIfNotExists() {
    const user = await user_model_1.default.findOne({ email: 'randomvisitor@mail.com' });
    if (!user) {
        console.log('creating visitor...');
        const visitor = new user_model_1.default(visitorData);
        await visitor.save();
    }
}
exports.createVisitorIfNotExists = createVisitorIfNotExists;
//# sourceMappingURL=visitor.js.map