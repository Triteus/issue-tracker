import { TestServer } from '../TestServer'
import { AuthController } from './auth';
import supertest, { SuperTest, Test } from 'supertest';
import { setupDB } from '../startup/testSetup';
import { Response } from 'superagent';
import UserModel from '../models/User';

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


        it('throws (email missing)', async () => {
            const { email, ...payload } = userMock;
            const res = await request.post(url).send(payload);
            checkResponse(res, 'email', 'Invalid e-mail');
        })

        it('throws (email invalid)', async () => {
            const payload = { ...userMock, email: 'invalidmail.com' };
            const res = await request.post(url).send(payload);
            checkResponse(res, 'email', 'Invalid e-mail');
        })

        it('throws (email aready exists)', async () => {
            const user = new UserModel(userMock);
            await user.save();

            const res = await request.post(url).send(userMock);
            checkResponse(res, 'email', 'E-mail already in use');
        })

        it('throws (password missing)', async () => {
            const { password, ...payload } = userMock;
            const res = await request.post(url).send(payload);
            checkResponse(res, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (password too short)', async () => {
            const payload = { ...userMock, password: 'abc' };
            const res = await request.post(url).send(payload);
            checkResponse(res, 'password', 'Password must at least be 6 characters long');
        })

        it('throws (firstname missing)', async () => {
            const { firstName, ...payload } = userMock;
            const res = await request.post(url).send(payload);
            checkResponse(res, 'firstName', 'First name is missing');
        })

        it('throws (lastname missing)', async () => {
            const { lastName, ...payload } = userMock;
            const res = await request.post(url).send(payload);
            checkResponse(res, 'lastName', 'Last name is missing');
        })

        it('returns with status 201 (valid payload)', async () => {
            const res = await request.post(url).send(userMock);
            expect(res.status).toBe(201);
        })

        it('create new user in db (valid payload)', async () => {
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

        it('throws (email missing)', async () => {
            const res = await request.post(url)
            .send({
                password
            })
            checkResponse(res, 'email', 'Invalid e-mail');
        })

        it('throws (password missing)', async () => {
            const res = await request.post(url)
            .send({
                email
            })
            checkResponse(res, 'password', 'Missing password');
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
    })
})