import { TestServer } from '../../TestServer'
import { AuthController } from './auth';
import supertest, { SuperTest, Test } from 'supertest';
import { setupDB } from '../../startup/testSetup';
import { Response } from 'superagent';
import UserModel, { IUser } from '../../models/User';
import { ownerData as userMock } from '../../test-data/user'

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

    let user: IUser;
    let token: string;


    beforeAll(() => {
        const testServer = new TestServer();
        testServer.setControllers(authController);
        request = supertest(testServer.getExpressInstance());
    })

    describe('POST /api/auth/register', () => {

        const url = '/api/auth/register';


        it('throws (email aready exists)', async () => {
            const user = new UserModel(userMock());
            await user.save();

            const res = await request.post(url).send(userMock());
            checkResponse(res, 'email', 'E-mail already in use');
        })

        it('returns with status 201 (valid payload)', async () => {
            const res = await request.post(url).send(userMock());
            expect(res.status).toBe(201);
        })

        it('creatse new user in db (valid payload)', async () => {
            const res = await request.post(url).send(userMock());
            const user = await UserModel.findOne({ email: userMock().email });
            expect(user).toBeTruthy();
        })
    })

    describe('POST /api/auth/login', () => {

        const url = '/api/auth/login';
        const { email, password } = userMock();

        beforeEach(async () => {
            await UserModel.create(userMock());
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
            expect(res.body.token).toBeTruthy();
        })
    }),
        describe('PUT /api/auth/password/:id', () => {

            const url = '/api/auth/password/';
            const { email, password } = userMock();

            const payload = {
                oldPW: password,
                newPW: 'newPassword',
                newPWConfirm: 'newPassword'
            }

            beforeEach(async () => {
                user = await UserModel.create(userMock());
                token = user.generateToken();
            })

            it('returns status 400 (invalid old password', async () => {
                const { oldPW, ...pl } = payload;
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ ...pl, oldPW: 'invalidPW' });
                expect(res.status).toBe(400);
            })

            it('returns with status 200', async () => {
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send(payload);
                expect(res.status).toBe(200);
            })

            it('changed password of user in the database', async () => {
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send(payload);

                const updatedUser = await UserModel.findById(user._id).select('+password');
                expect(updatedUser).toBeTruthy();
                const isSamePW = await updatedUser.comparePassword(payload.newPW);
                expect(isSamePW).toBe(true);
            })

        })

    describe('GET /api/auth/token', () => {
        const url = '/api/auth/token';

        beforeEach(async () => {
            user = await UserModel.create(userMock());
            token = user.generateToken();
        })

        it('throws 401 (user not authenticated)', async () => {
            const res = await request.get(url)
            expect(res.status).toBe(401);
        })

        it('returns status 200 with token', async () => {
            const res = await request.get(url)
                .set({ Authorization: 'Bearer ' + token })
            expect(res.status).toBe(200);
            expect(res.body.token).toBeTruthy();
        })

    })
}) 