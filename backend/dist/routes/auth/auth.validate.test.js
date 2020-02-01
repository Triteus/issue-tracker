"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_validate_1 = require("./auth.validate");
const testSetup_1 = require("../../startup/testSetup");
const test_util_1 = require("../../validators/test-util");
const user_1 = require("../../test-data/user");
describe('AuthController validation', () => {
    testSetup_1.setupDB('test-auth-controller-validation');
    describe('POST /api/auth/register', () => {
        const validators = auth_validate_1.AuthValidators.register;
        it('throws (email missing)', async () => {
            const { email, ...payload } = user_1.ownerData();
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'email', 'Invalid e-mail');
        });
        it('throws (email invalid)', async () => {
            const payload = { ...user_1.ownerData(), email: 'invalidmail.com' };
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'email', 'Invalid e-mail');
        });
        it('throws (email aready exists)', async () => {
            const user = new user_model_1.default(user_1.ownerData());
            await user.save();
            const errors = await test_util_1.validateBody(user_1.ownerData(), validators);
            test_util_1.checkResponse(errors, 'email', 'E-mail already in use');
        });
        it('throws (password missing)', async () => {
            const { password, ...payload } = user_1.ownerData();
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        });
        it('throws (password too short)', async () => {
            const payload = { ...user_1.ownerData(), password: 'abc' };
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        });
        it('throws (firstname missing)', async () => {
            const { firstName, ...payload } = user_1.ownerData();
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'firstName', 'First name is missing');
        });
        it('throws (lastname missing)', async () => {
            const { lastName, ...payload } = user_1.ownerData();
            const errors = await test_util_1.validateBody(payload, validators);
            test_util_1.checkResponse(errors, 'lastName', 'Last name is missing');
        });
        it('throws no errors', async () => {
            const errors = await test_util_1.validateBody(user_1.ownerData(), validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('POST /api/auth/login', () => {
        const validators = auth_validate_1.AuthValidators.login;
        const { email, password } = user_1.ownerData();
        it('throws (email missing)', async () => {
            const errors = await test_util_1.validateBody({ password }, validators);
            test_util_1.checkResponse(errors, 'email', 'Invalid e-mail');
        });
        it('throws (password missing)', async () => {
            const errors = await test_util_1.validateBody({ email }, validators);
            test_util_1.checkResponse(errors, 'password', 'Missing password');
        });
    }),
        describe('PUT /api/auth/password/:id', () => {
            const validators = auth_validate_1.AuthValidators.changePassword;
            const payload = {
                oldPW: user_1.ownerData().password,
                newPW: 'newPassword',
                newPWConfirm: 'newPassword'
            };
            it('throws (no oldPW in payload)', async () => {
                const { oldPW, ...rest } = payload;
                const errors = await test_util_1.validateBody(rest, validators);
                test_util_1.checkResponse(errors, 'oldPW', 'Invalid value');
            });
            it('throws (no newPW in payload)', async () => {
                const { newPW, ...rest } = payload;
                const errors = await test_util_1.validateBody(rest, validators);
                test_util_1.checkResponse(errors, 'newPW', 'Invalid value');
            });
            it('throws (no newPWConfirm in payload)', async () => {
                const { newPWConfirm, ...rest } = payload;
                const errors = await test_util_1.validateBody(rest, validators);
                test_util_1.checkResponse(errors, 'newPW', 'Password confirmation does not match password');
            });
            it('throws (newPW !== newPWConfirm)', async () => {
                const errors = await test_util_1.validateBody({ ...payload, newPWConfirm: 'wrongPW' }, validators);
                test_util_1.checkResponse(errors, 'newPW', 'Password confirmation does not match password');
            });
        });
});
//# sourceMappingURL=auth.validate.test.js.map