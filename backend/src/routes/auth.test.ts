import { TestServer } from '../TestServer'
import { AuthController } from './auth';
import supertest, { SuperTest, Test } from 'supertest';
import { setupDB } from '../startup/testSetup';
import { Response } from 'superagent';
import UserModel, { IUser } from '../models/User';

function checkResponse(res: Response, expectedParam: String, expectedMsg: String) {
    expect(res.status).toBe(422);

    const err = res.body.errors[0];
    expect(err.param).toBe(expectedParam);
    expect(err.msg).toBe(expectedMsg);
}

describe('AuthController', () => {

    const authController = new AuthController();
    let request: SuperTest<Test>;

    setupDB('test-auth-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(authController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    const userMock = {
        firstName: 'Joe',
        lastName: 'Mama',
        email: 'test@mail.com',
        password: 'password'
    }

    describe('POST /api/auth/register', () => {

        const url = '/api/auth/register';


        it('throws (email aready exists)', async () => {
            const user = new UserModel(userMock);
            await user.save();

            const res = await request.post(url).send(userMock);
            checkResponse(res, 'email', 'E-mail already in use');
        })

        it('returns with status 201 (valid payload)', async () => {
            const res = await request.post(url).send(userMock);
            expect(res.status).toBe(201);
        })

        it('creatse new user in db (valid payload)', async () => {
            const res = await request.post(url).send(userMock);
            const user = await UserModel.findOne({ email: userMock.email });
            expect(user).toBeTruthy();
        })
    })

    describe('POST /api/auth/login', () => {

        const url = '/api/auth/login';
        const { email, password } = userMock;
        
        beforeEach(async () => {
            const hashedPW = await UserModel.hashPassword(password);
            await UserModel.insertMany({...userMock, password: hashedPW});
        })

        it('throws (user does not exist, wrong email or pw)', async () => {
            const res = await request.post(url)
            .send({
                password,
                email: 'unknown@mail.com'
            })
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Incorrect email or password');
        })

        it('returns status 200 (valid user)', async () => {
            const res = await request.post(url)
            .send({
                password,
                email
            })
            expect(res.status).toBe(200);
        })

        it('returns response with token and user (valid user)', async () => {
            const res = await request.post(url)
            .send({
                password,
                email
            })
            expect(res.body.user).toMatchObject({email});
            expect(res.body.token).toBeTruthy();
        })
    }),
    describe('PUT /api/auth/password/:id', () => {
        
        const url = '/api/auth/password/';
        const { email, password } = userMock;
        let user: IUser;
        let token: string;
        
        const payload = {
            oldPW: userMock.password,
            newPW: 'newPassword',
            newPWConfirm: 'newPassword'
        }

        beforeEach(async () => {
            const hashedPW = await UserModel.hashPassword(password);
            user = await UserModel.create({...userMock, password: hashedPW});
            token = user.generateToken();
        })

        it('throws (id does not belong to owner)', async() => {
            const res = await request.put(url + 'invalidID')
            .set({Authorization: 'Bearer ' + token })
            .send(payload);
            expect(res.status).toBe(403);
        })

     
        it('returns status 400 (invalid old password', async () => {
            const {oldPW, ...pl} = payload;
            const res = await request.put(url + user._id)
            .set({Authorization: 'Bearer ' + token })
            .send({...pl, oldPW: 'invalidPW'});
            expect(res.status).toBe(400);
        })

        it('returns with status 200', async () => {
            const res = await request.put(url + user._id)
            .set({Authorization: 'Bearer ' + token })
            .send(payload);
            expect(res.status).toBe(200);
        })

        it('changed password of user in the database', async () => {
            const res = await request.put(url + user._id)
            .set({Authorization: 'Bearer ' + token })
            .send(payload);

            const updatedUser = await UserModel.findById(user._id).select('+password');
            expect(updatedUser).toBeTruthy();
            const isSamePW = await updatedUser.comparePassword(payload.newPW);
            expect(isSamePW).toBe(true);
        })

    })
}) 