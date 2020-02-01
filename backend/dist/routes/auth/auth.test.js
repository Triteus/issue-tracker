"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestServer_1 = require("../../TestServer");
const auth_1 = require("./auth");
const supertest_1 = __importDefault(require("supertest"));
const testSetup_1 = require("../../startup/testSetup");
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_1 = require("../../test-data/user");
function checkResponse(res, expectedParam, expectedMsg) {
    expect(res.status).toBe(422);
    const err = res.body.errors[0];
    expect(err.param).toBe(expectedParam);
    expect(err.msg).toBe(expectedMsg);
}
describe('AuthController', () => {
    const authController = new auth_1.AuthController();
    let request;
    testSetup_1.setupDB('test-auth-controller');
    let user;
    let token;
    beforeAll(() => {
        const testServer = new TestServer_1.TestServer();
        testServer.setControllers(authController);
        request = supertest_1.default(testServer.getExpressInstance());
    });
    describe('POST /api/auth/register', () => {
        const url = '/api/auth/register';
        it('throws (email aready exists)', async () => {
            const user = new user_model_1.default(user_1.ownerData());
            await user.save();
            const res = await request.post(url).send(user_1.ownerData());
            checkResponse(res, 'email', 'E-mail already in use');
        });
        it('returns with status 201 (valid payload)', async () => {
            const res = await request.post(url).send(user_1.ownerData());
            expect(res.status).toBe(201);
        });
        it('creatse new user in db (valid payload)', async () => {
            const res = await request.post(url).send(user_1.ownerData());
            const user = await user_model_1.default.findOne({ email: user_1.ownerData().email });
            expect(user).toBeTruthy();
        });
    });
    describe('POST /api/auth/login', () => {
        const url = '/api/auth/login';
        const { email, password } = user_1.ownerData();
        beforeEach(async () => {
            await user_model_1.default.create(user_1.ownerData());
        });
        it('throws (user does not exist, wrong email or pw)', async () => {
            const res = await request.post(url)
                .send({
                password,
                email: 'unknown@mail.com'
            });
            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Incorrect email or password');
        });
        it('returns status 200 (valid user)', async () => {
            const res = await request.post(url)
                .send({
                password,
                email
            });
            expect(res.status).toBe(200);
        });
        it('returns response with token and user (valid user)', async () => {
            const res = await request.post(url)
                .send({
                password,
                email
            });
            expect(res.body.token).toBeTruthy();
        });
    }),
        describe('PUT /api/auth/password/:id', () => {
            const url = '/api/auth/password/';
            const { email, password } = user_1.ownerData();
            const payload = {
                oldPW: password,
                newPW: 'newPassword',
                newPWConfirm: 'newPassword'
            };
            beforeEach(async () => {
                user = await user_model_1.default.create(user_1.ownerData());
                token = user.generateToken();
            });
            it('returns status 400 (invalid old password', async () => {
                const { oldPW, ...pl } = payload;
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ ...pl, oldPW: 'invalidPW' });
                expect(res.status).toBe(400);
            });
            it('returns with status 200', async () => {
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send(payload);
                expect(res.status).toBe(200);
            });
            it('changed password of user in the database', async () => {
                const res = await request.put(url)
                    .set({ Authorization: 'Bearer ' + token })
                    .send(payload);
                const updatedUser = await user_model_1.default.findById(user._id).select('+password');
                expect(updatedUser).toBeTruthy();
                const isSamePW = await updatedUser.comparePassword(payload.newPW);
                expect(isSamePW).toBe(true);
            });
        });
    describe('GET /api/auth/token', () => {
        const url = '/api/auth/token';
        beforeEach(async () => {
            user = await user_model_1.default.create(user_1.ownerData());
            token = user.generateToken();
        });
        it('throws 401 (user not authenticated)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        });
        it('returns status 200 with token', async () => {
            const res = await request.get(url)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeTruthy();
        });
    });
});
//# sourceMappingURL=auth.test.js.map