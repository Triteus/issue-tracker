"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./User"));
describe('UserModel', () => {
    const user = new User_1.default({ email: 'test@mail.com', password: 'password', firstName: 'Max', lastName: 'Mustermann' });
    it('hashes password before saving it to db', async () => {
        await user.validate();
        console.log('password', user.password);
        expect(user.password).not.toBe('password');
    });
    it('delete path "__v" and "_id" (toJSON)', () => {
        const userJSON = user.toJSON();
        expect(userJSON.__v).toBeFalsy();
        expect(userJSON._id).toBeFalsy();
    });
});
//# sourceMappingURL=user.model.test.js.map