"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("./file");
const testSetup_1 = require("../../startup/testSetup");
const TestServer_1 = require("../../TestServer");
const supertest = require("supertest");
const user_model_1 = __importDefault(require("../../models/user.model"));
const user_1 = require("../../test-data/user");
const upload_service_1 = require("../../services/upload.service");
describe('UploadController', () => {
    let uploadController;
    let request;
    testSetup_1.setupDB('test-upload-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        uploadController = new file_1.FileController(new upload_service_1.UploadService());
        testServer.setControllers(uploadController);
        request = supertest(testServer.getExpressInstance());
        done();
    });
    describe('POST /api/file', () => {
        const url = '/api/file';
        let user;
        let token;
        beforeEach(async () => {
            user = await user_model_1.default.create(user_1.ownerData());
            token = user.generateToken();
        });
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.post(url).send({});
            expect(res.status).toBe(401);
        });
        it('returns status 400 (no files sent)', async () => {
            const res = await request.post(url).send({})
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(400);
        });
        it('returns status 201', async () => {
            // TODO: figure out how to properly mock multer
        });
    });
    describe('GET /api/file', () => {
        const url = '/api/file';
        let user;
        let token;
        beforeEach(async () => {
            user = await user_model_1.default.create(user_1.ownerData());
            token = user.generateToken();
        });
        it('returns 401 (not authenticated)', async () => {
            const res = await request.get(url + '/abc.png');
            expect(res.status).toBe(401);
        });
        it('returns 404 (file not found)', async () => {
            const res = await request.get(url + '/unknown-file.pdf')
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(404);
        });
    });
});
//# sourceMappingURL=file.test.js.map