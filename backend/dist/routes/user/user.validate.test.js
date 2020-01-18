"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testSetup_1 = require("../../startup/testSetup");
const user_validate_1 = require("./user.validate");
const test_util_1 = require("../../validators/test-util");
describe('Usercontroller validation', () => {
    testSetup_1.setupDB('user-controller-validation-test');
    describe(' PATCH /api/user/:id', () => {
        const validators = user_validate_1.UserValidators.change;
        it('throws if invalid email was given', async () => {
            const errors = await test_util_1.validateBody({ email: 'invalidMail.com' }, validators);
            test_util_1.checkResponse(errors, 'email', 'Invalid e-mail');
        });
        it('throws (tried to change password)', async () => {
            const errors = await test_util_1.validateBody({ password: 'password' }, validators);
            test_util_1.checkResponse(errors, 'password', 'Invalid value');
        });
        it('throws (tried to change _id)', async () => {
            const errors = await test_util_1.validateBody({ _id: 'abc' }, validators);
            test_util_1.checkResponse(errors, '_id', 'Invalid value');
        });
        it('throws (tried to change id)', async () => {
            const errors = await test_util_1.validateBody({ id: 'abc' }, validators);
            test_util_1.checkResponse(errors, 'id', 'Invalid value');
        });
        it('does not throw (no params)', async () => {
            const errors = await test_util_1.validateBody({}, validators);
            expect(errors.length).toBe(0);
        });
        it('does not throw (valid email)', async () => {
            const errors = await test_util_1.validateBody({ email: 'changed@mail.com' }, validators);
            expect(errors.length).toBe(0);
        });
    });
});
//# sourceMappingURL=user.validate.test.js.map