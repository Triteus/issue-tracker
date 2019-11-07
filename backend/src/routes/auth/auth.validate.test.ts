import UserModel, { IUser } from '../../models/User';
import { AuthValidators } from './auth.validate';
import { setupDB } from '../../startup/testSetup';
import { checkResponse, validateBody } from '../../validators/test-util';
import { ownerData } from '../../test-data/user';


describe('AuthController validation', () => {

    setupDB('test-auth-controller-validation');

    describe('POST /api/auth/register', () => {

        const validators = AuthValidators.register;

        it('throws (email missing)', async () => {
            const { email, ...payload } = ownerData();
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })

        it('throws (email invalid)', async () => {
            const payload = { ...ownerData(), email: 'invalidmail.com' };
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })

        it('throws (email aready exists)', async () => {
            const user = new UserModel(ownerData());
            await user.save();

            const errors = await validateBody(ownerData(), validators);
            checkResponse(errors, 'email', 'E-mail already in use');
        })

        it('throws (password missing)', async () => {
            const { password, ...payload } = ownerData();
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (password too short)', async () => {
            const payload = { ...ownerData(), password: 'abc' };
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (firstname missing)', async () => {
            const { firstName, ...payload } = ownerData();
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'firstName', 'First name is missing');
        })

        it('throws (lastname missing)', async () => {
            const { lastName, ...payload } = ownerData();
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'lastName', 'Last name is missing');
        })

        it('throws no errors', async () => {
            const errors = await validateBody(ownerData(), validators);
            expect(errors.length).toBe(0);
        })
    })

    describe('POST /api/auth/login', () => {

        const validators = AuthValidators.login;
        const { email, password } = ownerData();

        it('throws (email missing)', async () => {
            const errors = await validateBody({ password }, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })

        it('throws (password missing)', async () => {
            const errors = await validateBody({ email }, validators);
            checkResponse(errors, 'password', 'Missing password');
        })
    }),
        describe('PUT /api/auth/password/:id', () => {

            const validators = AuthValidators.changePassword;

            const payload = {
                oldPW: ownerData().password,
                newPW: 'newPassword',
                newPWConfirm: 'newPassword'
            }

            it('throws (no oldPW in payload)', async () => {
                const { oldPW, ...rest } = payload;
                const errors = await validateBody(rest, validators);
                checkResponse(errors, 'oldPW', 'Invalid value');
            })

            it('throws (no newPW in payload)', async () => {
                const { newPW, ...rest } = payload;
                const errors = await validateBody(rest, validators);
                checkResponse(errors, 'newPW', 'Invalid value');
            })

            it('throws (no newPWConfirm in payload)', async () => {
                const { newPWConfirm, ...rest } = payload;
                const errors = await validateBody(rest, validators);
                checkResponse(errors, 'newPW', 'Password confirmation does not match password');
            })

            it('throws (newPW !== newPWConfirm)', async () => {
                const errors = await validateBody({...payload, newPWConfirm: 'wrongPW'}, validators);
                checkResponse(errors, 'newPW', 'Password confirmation does not match password');
            })

        })
})