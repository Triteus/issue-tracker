import { ProjectController } from "../v2/project/project";
import { SuperTest, Test } from "supertest";
import supertest from "supertest";
import { setupDB } from "../../startup/testSetup";
import { TestServer } from "../../TestServer";
import UserModel, { ERole } from "../../models/user.model";
import { ownerData } from "../../test-data/user";
import { AuthController } from "../auth/auth";
import { GlobalController } from "./global";
import { authHeaderObject } from "../../util/test-util";

describe('GlobalController', () => {

    const globalController = new GlobalController();
    let request: SuperTest<Test>;

    setupDB('test-global-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(globalController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    describe('POST api/*', () => {

        it('passes through (user wants to login)', async () => {
            const res = await request.post('/api/auth/login')
            expect(res.status).not.toBe(403);
            expect(res.status).not.toBe(401);
        })
        it('passes through (user wants to register)', async () => {
            const res = await request.post('/api/auth/register')
            expect(res.status).not.toBe(403);
            expect(res.status).not.toBe(401);
        })

        it('throws 403 (user with visitor role)', async () => {
            let user = new UserModel({...ownerData(), roles: [ERole.Visitor]});
            user = await user.save();
            const res = await request.post('/api/random-route')
            .set(authHeaderObject(user.generateToken()));
            expect(res.status).toBe(403);
        })
        it('passes through (user without visitor role)', async () => {
            let user = new UserModel({...ownerData()});
            user = await user.save();
            const res = await request.post('/api/random-route')
            .set(authHeaderObject(user.generateToken()));
            expect(res.status).not.toBe(403);
        })

    })

});