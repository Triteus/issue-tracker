"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest = require("supertest");
const bson_1 = require("bson");
const project_1 = require("./project");
const testSetup_1 = require("../../../startup/testSetup");
const TestServer_1 = require("../../../TestServer");
const Project_1 = require("../../../models/Project");
const User_1 = __importDefault(require("../../../models/User"));
const user_1 = require("../../../test-data/user");
const project_2 = require("../../../test-data/project");
const test_util_1 = require("../../../util/test-util");
const mongoose_1 = require("mongoose");
describe(('ProjectController'), () => {
    const projectController = new project_1.ProjectController();
    let request;
    testSetup_1.setupDB('test-project-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        testServer.setControllers(projectController);
        request = supertest(testServer.getExpressInstance());
        done();
    });
    let project;
    let user;
    let token;
    beforeEach(async () => {
        user = await User_1.default.create(user_1.randomUserData());
        token = user.generateToken();
    });
    describe('GET /api/v2/project', () => {
        const url = '/api/v2/project/';
        beforeEach(async () => {
            project = new Project_1.ProjectModel(project_2.projectData());
            await project.addUserToProjectAndSave(user._id);
        });
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        });
        it('returns array of projects', async () => {
            const res = await request.get(url)
                .set(test_util_1.authHeaderObject(token));
            expect(res.status).toBe(200);
            expect(res.body.projects[0].id).toBe(project._id.toString());
        });
    });
    describe('GET /api/v2/project/:id', () => {
        const url = '/api/v2/project/';
        beforeEach(async () => {
            project = new Project_1.ProjectModel(project_2.projectData());
            await project.addUserToProjectAndSave(user._id);
        });
        it('returns status 401 (not authenticated)', async () => {
            // set not token
            const res = await request.get(url + project._id);
            expect(res.status).toBe(401);
        });
        it('returns status 404 (project not found)', async () => {
            const id = new bson_1.ObjectID();
            const res = await request.get(url + id)
                .set(test_util_1.authHeaderObject(token));
            expect(res.status).toBe(404);
        });
        it('returns status 200 with project as payload', async () => {
            const res = await request.get(url + project._id)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(200);
            expect(res.body.project.id).toBe(project._id.toString());
        });
    });
    describe('POST /api/v2/project', () => {
        const url = '/api/v2/project/';
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.post(url)
                .send({});
            expect(res.status).toBe(401);
        });
        it('returns status 422 (invalid payload)', async () => {
            const res = await request.post(url)
                .set(test_util_1.authHeaderObject(token))
                .send({});
            expect(res.status).toBe(422);
        });
        it('return status 201 and created project', async () => {
            const res = await request.post(url)
                .set(test_util_1.authHeaderObject(token))
                .send(project_2.projectData());
            expect(res.status).toBe(201);
            expect(res.body.project.name).toBe(project_2.projectData().name);
        });
        it('set projectLeader to user who created project', async () => {
            const res = await request.post(url)
                .set(test_util_1.authHeaderObject(token))
                .send(project_2.projectData());
            expect(res.body.project.projectLeader + '').toBe(user._id + '');
            expect(res.body.project.assignedUsers).toContain(user._id + '');
        });
    });
    describe('PUT /api/v2/project/:projectId', () => {
        const url = '/api/v2/project/';
        let leader;
        beforeEach(async () => {
            leader = await User_1.default.create(user_1.ownerData());
            project = new Project_1.ProjectModel(project_2.projectData());
            await project.addUserToProjectAndSave(user._id);
        });
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.put(url + project._id)
                .send({});
            expect(res.status).toBe(401);
        });
        it('returns status 422 (invalid payload)', async () => {
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(token))
                .send({});
            expect(res.status).toBe(422);
        });
        it('return status 403 (user is not project-leader)', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(token))
                .send(project_2.updatedProjectData());
            expect(res.status).toBe(403);
        });
        it('maps assigned users to their ids if they were populated', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();
            const id = new mongoose_1.Types.ObjectId();
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(leaderToken))
                .send({ ...project_2.updatedProjectData(), assignedUsers: [{ username: 'random', id }] });
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.assignedUsers[0].toString()).toBe(id.toHexString());
        });
        it('returns status 200 and updated ticket', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(leaderToken))
                .send(project_2.updatedProjectData());
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.name).toBe(project_2.updatedProjectData().name);
        });
    });
    describe('DELETE /api/v2/project/:projectId', () => {
        const url = '/api/v2/project/';
        let leader;
        beforeEach(async () => {
            leader = await User_1.default.create(user_1.ownerData());
            project = await Project_1.ProjectModel.create(project_2.projectData());
        });
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.delete(url + project._id);
            expect(res.status).toBe(401);
        });
        it('return status 403 (user is not project-leader)', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const res = await request.delete(url + project._id)
                .set(test_util_1.authHeaderObject(token));
            expect(res.status).toBe(403);
        });
        it('returns status 200 and updated ticket', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(leaderToken))
                .send(project_2.updatedProjectData());
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.name).toBe(project_2.updatedProjectData().name);
        });
    });
    describe('PATCH /api/v2/project', () => {
        const url = '/api/v2/project/';
        let leader;
        beforeEach(async () => {
            leader = await User_1.default.create(user_1.ownerData());
            project = await Project_1.ProjectModel.create(project_2.projectData());
        });
        it('returns status 401 (not authenticated)', async () => {
            const res = await request.patch(url + project._id + '/assignedUsers');
            expect(res.status).toBe(401);
        });
        it('return status 403 (user is not project-leader)', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const res = await request.patch(url + project._id + '/assignedUsers')
                .set(test_util_1.authHeaderObject(token))
                .send(project_2.updatedProjectData());
            expect(res.status).toBe(403);
        });
        it('returns status 200 and ticket with updated assigned users', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();
            const id = new mongoose_1.Types.ObjectId();
            const res = await request.put(url + project._id)
                .set(test_util_1.authHeaderObject(leaderToken))
                .send({ ...project_2.updatedProjectData(), assignedUsers: [id] });
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.assignedUsers[0].toString()).toBe(id.toHexString());
        });
    });
});
//# sourceMappingURL=project.test.js.map