import UserModel, { IUser } from '../models/User';
import { AuthValidators } from './auth.validate';
import { setupDB } from '../startup/testSetup';
import { checkResponse, validateBody } from '../validators/test-util';


describe('AuthController validation', () => {

    setupDB('test-auth-controller-validation');

    const userMock = {
        firstName: 'Joe',
        lastName: 'Mama',
        email: 'test@mail.com',
        password: 'password'
    }

    describe('POST /api/auth/register', () => {

        const validators = AuthValidators.register;

        it('throws (email missing)', async () => {
            const { email, ...payload } = userMock;
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })

        it('throws (email invalid)', async () => {
            const payload = { ...userMock, email: 'invalidmail.com' };
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })

        it('throws (email aready exists)', async () => {
            const user = new UserModel(userMock);
            await user.save();

            const errors = await validateBody(userMock, validators);
            checkResponse(errors, 'email', 'E-mail already in use');
        })

        it('throws (password missing)', async () => {
            const { password, ...payload } = userMock;
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (password too short)', async () => {
            const payload = { ...userMock, password: 'abc' };
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (firstname missing)', async () => {
            const { firstName, ...payload } = userMock;
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'firstName', 'First name is missing');
        })

        it('throws (lastname missing)', async () => {
            const { lastName, ...payload } = userMock;
            const errors = await validateBody(payload, validators);
            checkResponse(errors, 'lastName', 'Last name is missing');
        })

        it('throws no errors', async () => {
            const errors = await validateBody(userMock, validators);
            expect(errors.length).toBe(0);
        })
    })

    describe('POST /api/auth/login', () => {

        const validators = AuthValidators.login;
        const { email, password } = userMock;

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

            const { email, password } = userMock;
            let user: IUser;

            const validators = AuthValidators.changePassword;

            const payload = {
                oldPW: userMock.password,
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