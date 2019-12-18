import { SuperTest, Test } from "supertest";
import supertest = require("supertest");

import { ObjectID } from "bson";
import { ProjectController } from "./project";
import { setupDB } from "../../../startup/testSetup";
import { TestServer } from "../../../TestServer";
import { IProject, ProjectModel } from "../../../models/Project";
import UserModel, { IUser } from "../../../models/User";
import { randomUserData, ownerData } from "../../../test-data/user";
import { projectData, updatedProjectData } from "../../../test-data/project";
import { authHeaderObject } from "../../../util/test-util";


describe(('UserController'), () => {

    const userController = new ProjectController();
    let request: SuperTest<Test>;

    setupDB('test-project-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(userController);
        request = supertest(testServer.getExpressInstance());
        done();
    })


    let project: IProject;
    let user: IUser;
    let token: string;


    beforeEach(async () => {
        user = await UserModel.create(randomUserData());
        token = user.generateToken();
    })

    describe('GET /api/v2/project', () => {

        const url = '/api/v2/project/'

        beforeEach(async () => {
            project = await ProjectModel.create(projectData());
        })

        it('returns status 401 (not authenticated)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        })

        it('returns array of projects', async () => {
            const res = await request.get(url)
                .set(authHeaderObject(token))
            expect(res.status).toBe(200);
            expect(res.body.projects[0].id).toBe(project._id.toString());
        })

    })

    describe('GET /api/v2/project/:id', () => {

        const url = '/api/v2/project/';

        beforeEach(async () => {
            project = await ProjectModel.create(projectData());
        })

        it('returns status 401 (not authenticated)', async () => {
            // set not token
            const res = await request.get(url + project._id);
            expect(res.status).toBe(401);
        })

        it('returns status 404 (project not found)', async () => {
            const id = new ObjectID();
            const res = await request.get(url + id)
                .set(authHeaderObject(token));
            expect(res.status).toBe(404);
        })

        it('returns status 200 with project as payload', async () => {
            const res = await request.get(url + project._id)
                .set({ Authorization: 'Bearer ' + token });
            expect(res.status).toBe(200);
            expect(res.body.project.id).toBe(project._id.toString());
        })
    })

    describe('POST /api/v2/project', () => {

        const url = '/api/v2/project/'

        it('returns status 401 (not authenticated)', async () => {
            const res = await request.post(url)
                .send({});
            expect(res.status).toBe(401);
        })

        it('returns status 422 (invalid payload)', async () => {
            const res = await request.post(url)
                .set(authHeaderObject(token))
                .send({});
            expect(res.status).toBe(422);
        })

        it('return status 201 and created project', async () => {
            const res = await request.post(url)
                .set(authHeaderObject(token))
                .send(projectData());
            expect(res.status).toBe(201);
            expect(res.body.project.name).toBe(projectData().name);
        })

        it('set projectLeader to user who created project', async () => {
            const res = await request.post(url)
                .set(authHeaderObject(token))
                .send(projectData());
            expect(res.body.project.projectLeader + '').toBe(user._id + '');
        })
    })

    describe('PUT /api/v2/project/:projectId', () => {

        const url = '/api/v2/project/';
        let leader: IUser;

        beforeEach(async () => {
            leader = await UserModel.create(ownerData());
            project = await ProjectModel.create(projectData());
        })

        it('returns status 401 (not authenticated)', async () => {
            const res = await request.put(url + project._id)
                .send({});
            expect(res.status).toBe(401);
        })

        it('returns status 422 (invalid payload)', async () => {
            const res = await request.put(url + project._id)
                .set(authHeaderObject(token))
                .send({});
            expect(res.status).toBe(422);
        })

        it('return status 403 (user is not project-leader)', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();

            const res = await request.put(url + project._id)
                .set(authHeaderObject(token))
                .send(updatedProjectData())
            expect(res.status).toBe(403);
        })

        it('returns status 200 and updated ticket', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();

            const res = await request.put(url + project._id)
                .set(authHeaderObject(leaderToken))
                .send(updatedProjectData())
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.name).toBe(updatedProjectData().name);
        })
    })

    describe('DELETE /api/v2/project/:projectId', () => {


        const url = '/api/v2/project/';
        let leader: IUser;

        beforeEach(async () => {
            leader = await UserModel.create(ownerData());
            project = await ProjectModel.create(projectData());
        })

        it('returns status 401 (not authenticated)', async () => {
            const res = await request.delete(url + project._id)
            expect(res.status).toBe(401);
        })


        it('return status 403 (user is not project-leader)', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();

            const res = await request.delete(url + project._id)
                .set(authHeaderObject(token))
            expect(res.status).toBe(403);
        })

        it('returns status 200 and updated ticket', async () => {
            project.set({ projectLeader: leader._id });
            await project.save();
            const leaderToken = leader.generateToken();

            const res = await request.put(url + project._id)
                .set(authHeaderObject(leaderToken))
                .send(updatedProjectData())
            expect(res.status).toBe(200);
            expect(res.body.updatedProject.name).toBe(updatedProjectData().name);
        })

    })
})