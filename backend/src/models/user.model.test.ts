import UserModel from './User';

describe('UserModel', () => {
    const user = new UserModel({email: 'test@mail.com', password: 'password', firstName: 'Max', lastName: 'Mustermann'});

    it('hashes password before saving it to db', async () => {
        await user.validate();
        console.log('password', user.password);
        expect(user.password).not.toBe('password');
    })

    it('delete path "__v" and "_id" (toJSON)', () => {
        const userJSON = user.toJSON();
        expect(userJSON.__v).toBeFalsy();
        expect(userJSON._id).toBeFalsy();
    })


})