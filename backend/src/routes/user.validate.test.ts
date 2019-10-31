import { setupDB } from "../startup/testSetup"
import { UserValidators } from "./user.validate";
import { checkResponse, validate } from "../validators/test-util";

describe('Usercontroller validation', () => {

    setupDB('user-controller-validation-test');

    describe(' PATCH /api/user/:id', () => {

        const validators = UserValidators.change;

        it('throws if invalid email was given', async () => {
            const errors = await validate({email: 'invalidMail.com'}, validators);
            checkResponse(errors, 'email', 'Invalid e-mail');
        })
        it('throws (tried to change password)', async () => {
            const errors = await validate({password: 'password'}, validators);
            checkResponse(errors, 'password', 'Invalid value');
        })
        it('throws (tried to change _id)', async () => {
            const errors = await validate({_id: 'abc'}, validators);
            checkResponse(errors, '_id', 'Invalid value');
        })
        it('throws (tried to change id)', async () => {
            const errors = await validate({id: 'abc'}, validators);
            checkResponse(errors, 'id', 'Invalid value');
        })
        it('does not throw (no params)', async () => {
            const errors = await validate({}, validators);
            expect(errors.length).toBe(0);
        })
        it('does not throw (valid email)', async () => {
            const errors = await validate({email: 'changed@mail.com'}, validators);
            expect(errors.length).toBe(0);
        })
    })
})