"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const testSetup_1 = require("../../startup/testSetup");
const TestServer_1 = require("../../TestServer");
const User_1 = __importStar(require("../../models/User"));
const user_1 = require("../../test-data/user");
const global_1 = require("./global");
const test_util_1 = require("../../util/test-util");
describe('GlobalController', () => {
    const globalController = new global_1.GlobalController();
    let request;
    testSetup_1.setupDB('test-global-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        testServer.setControllers(globalController);
        request = supertest_1.default(testServer.getExpressInstance());
        done();
    });
    describe('POST api/*', () => {
        it('passes through (user wants to login)', async () => {
            const res = await request.post('/api/auth/login');
            expect(res.status).not.toBe(403);
            expect(res.status).not.toBe(401);
        });
        it('passes through (user wants to register)', async () => {
            const res = await request.post('/api/auth/register');
            expect(res.status).not.toBe(403);
            expect(res.status).not.toBe(401);
        });
        it('throws 403 (user with visitor role)', async () => {
            let user = new User_1.default({ ...user_1.ownerData(), roles: [User_1.ERole.Visitor] });
            user = await user.save();
            const res = await request.post('/api/random-route')
                .set(test_util_1.authHeaderObject(user.generateToken()));
            expect(res.status).toBe(403);
        });
        it('passes through (user without visitor role)', async () => {
            let user = new User_1.default({ ...user_1.ownerData() });
            user = await user.save();
            const res = await request.post('/api/random-route')
                .set(test_util_1.authHeaderObject(user.generateToken()));
            expect(res.status).not.toBe(403);
        });
    });
});
//# sourceMappingURL=global.test.js.map