import { setupDB } from "../../startup/testSetup"
import { SuperTest, Test } from "supertest";
import supertest = require("supertest");
import { TestServer } from "../../TestServer";
import { UserController } from "./user";
import UserModel, { IUser, ERole } from "../../models/User";
import { ObjectID } from "bson";

describe(('UserController'), () => {

    const userController = new UserController();
    let request: SuperTest<Test>;

    setupDB('test-user-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(userController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    let user: IUser;
    let token: string;
    const payload = {
        email: 'test@mail.com',
        password: 'password123',
        firstName: 'Biggus',
        lastName: 'Dickus'
    }
    beforeEach(async () => {
        user = await UserModel.create(payload);
        token = user.generateToken();
    })

    describe('GET /api/user', () => {
        it('returns all users', () => {

        })
    })

    describe('GET /api/user/:id', () => {

        const url = '/api/user/';

        it('returns status 401 (not authenticated)', async () => {
            // set not token
            const res = await request.get(url + user._id);
            expect(res.status).toBe(401);
        })

        it('returns status 404 (user not found)', async () => {
            const id = new ObjectID();
            const res = await request.get(url + id)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(404);
        })

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
        })
    }),

        describe('PATCH /api/user/:id', () => {

            const url = '/api/user/';

            it('returns status 401 (not authenticated)', async () => {
                const res = await request.patch(url + user._id)
                    .send({ email: 'changed@mail.com' });
                expect(res.status).toBe(401);
            })
            it('returns status 403 (user is not owner of account)', async () => {
                // create second user 
                const secondUser = await UserModel.create({
                    ...payload,
                    email: 'secondUser@mail.com'
                });

                // try to change email of second user, but with token of first user
                const res = await request.patch(url + secondUser._id)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ email: 'changed@mail.com' })
                expect(res.status).toBe(403);
            })

            it('changes email', async () => {
                const res = await request.patch(url + user._id)
                    .set({ Authorization: 'Bearer ' + token })
                    .send({ email: 'changed@mail.com' })

                const updatedUser = await UserModel.findById(user._id);
                expect(updatedUser.email).toBe('changed@mail.com');
            })
        })
})