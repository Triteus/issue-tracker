"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testSetup_1 = require("../../startup/testSetup");
const supertest = require("supertest");
const TestServer_1 = require("../../TestServer");
const user_1 = require("./user");
const User_1 = __importDefault(require("../../models/User"));
const bson_1 = require("bson");
const user_2 = require("../../test-data/user");
describe(('UserController'), () => {
    const userController = new user_1.UserController();
    let request;
    testSetup_1.setupDB('test-user-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        testServer.setControllers(userController);
        request = supertest(testServer.getExpressInstance());
        done();
    });
    let user;
    let token;
    beforeEach(async () => {
        user = await User_1.default.create(user_2.ownerData());
        token = user.generateToken();
    });
    describe('GET /api/user', () => {
        it('returns all users', () => {
        });
    });
    describe('GET /api/user/:id', () => {
        const url = '/api/user/';
        it('returns status 401 (not authenticated)', async () => {
            // set not token
            const res = await request.get(url + user._id);
            expect(res.status).toBe(401);
        });
        it('returns status 404 (user not found)', async () => {
            const id = new bson_1.ObjectID();
            const res = await request.get(url + id)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(404);
        });
        it('returns status 200 with user as payload', async () => {
            const res = await request.get(url + user._id)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({
                id: user.id,
                username: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                email: expect.any(String),
                roles: expect.any(Array),
            });
        });
    }),
        describe('PATCH /api/user/:id', () => {
            const url = '/api/user/';
            it('returns status 401 (not authenticated)', async () => {
                const res = await request.patch(url + user._id)
                    .send({ email: 'changed@mail.com' });
                expect(res.status).toBe(401);
            });
            it('returns status 403 (user is not owner of account)', async () => {
                // create second user 
                const secondUser = await User_1.default.create({
                    ...user_2.randomUserData(),
                    email: 'secondUser@mail.com'
                });
                // try to change email of second user, but with token of first user
                const res = await request.patch(url + secondUser._id)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ email: 'changed@mail.com' });
                expect(res.status).toBe(403);
            });
            it('returns status 422 (validator)', async () => {
                const res = await request.patch(url + user._id)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ email: 'invalidMail' });
                expect(res.status).toBe(422);
            });
            it('changes email', async () => {
                const res = await request.patch(url + user._id)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ email: 'changed@mail.com' });
                const updatedUser = await User_1.default.findById(user._id);
                expect(updatedUser.email).toBe('changed@mail.com');
            });
        });
});
//# sourceMappingURL=user.test.js.map