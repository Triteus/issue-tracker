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
const testSetup_1 = require("../../startup/testSetup");
const TestServer_1 = require("../../TestServer");
const supertest_1 = __importDefault(require("supertest"));
const User_1 = __importDefault(require("../../models/User"));
const Ticket_1 = __importStar(require("../../models/Ticket"));
const bson_1 = require("bson");
const ticket_1 = require("../../test-data/ticket");
const user_1 = require("../../test-data/user");
const project_1 = require("../v2/project/project");
const Project_1 = require("../../models/Project");
const project_2 = require("../../test-data/project");
const test_util_1 = require("../../util/test-util");
describe('TicketController', () => {
    const projectController = new project_1.ProjectController();
    let request;
    testSetup_1.setupDB('test-ticket-controller');
    beforeAll(async (done) => {
        const testServer = new TestServer_1.TestServer();
        testServer.setControllers(projectController);
        request = supertest_1.default(testServer.getExpressInstance());
        done();
    });
    let owner;
    let editor;
    let randomUser;
    let ticket;
    let project;
    const baseUrl = "/api/v2";
    let url = '';
    beforeEach(async () => {
        project = await Project_1.ProjectModel.create(project_2.projectData());
        url = `${baseUrl}/project/${project._id}/ticket/`;
    });
    describe('POST /api/v2/:projectId/ticket', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            await project.save();
        });
        it('returns status 401 (no token)', async () => {
            const res = await request
                .post(url)
                .send(ticket_1.ticketData());
            expect(res.status).toBe(401);
        });
        it('returns status 422 (validator)', async () => {
            const res = await request
                .post(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()))
                .send({ ...ticket_1.ticketData(), status: 'invalidStatus' });
            expect(res.status).toBe(422);
        });
        it('returns status 201', async () => {
            const res = await request
                .post(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()))
                .send(ticket_1.ticketData());
            expect(res.status).toBe(201);
        });
        it('returns newly created ticket', async () => {
            const res = await request
                .post(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()))
                .send(ticket_1.ticketData());
            expect(res.body.message).toBe('Ticket successfully created!');
            expect(res.body.ticket).toMatchObject({
                ...ticket_1.ticketData(),
                owner: owner._id.toHexString()
            });
        });
        it('created new ticket in db', async () => {
            const res = await request.post(url).send(ticket_1.ticketData());
            const ticket = await Ticket_1.default.find({ title: ticket_1.ticketData().title });
            expect(ticket).toBeTruthy();
        });
    });
    describe('PUT /api/v2/:projectId/ticket/:id', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            randomUser = await User_1.default.create(user_1.randomUserData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();
            ticket = new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id });
            project.tickets.push(ticket);
            await project.save();
        });
        it('returns status 401 (no token)', async () => {
            const res = await request.put(url + ticket._id)
                .send(ticket_1.updatedTicketData());
            expect(res.status).toBe(401);
        });
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.put(url + ticket._id)
                .set(test_util_1.authHeaderObject(randomUser.generateToken()))
                .send(ticket_1.updatedTicketData());
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        });
        it('returns status 404 (ticket does not exist)', async () => {
            const invalidId = new bson_1.ObjectID();
            const res = await request.put(url + invalidId)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send(ticket_1.updatedTicketData());
            expect(res.status).toBe(404);
        });
        it('returns status 200', async () => {
            const res = await request.put(url + ticket._id)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send(ticket_1.updatedTicketData());
            expect(res.status).toBe(200);
        });
        it('adds new history entry', async () => {
            const res = await request.put(url + ticket._id)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ ...ticket_1.ticketData(), description: 'new description' });
            expect(res.status).toBe(200);
            expect(res.body.ticket.editorHistory.length).toBe(ticket.editorHistory.length + 1);
        });
        it('returns message and ticket', async () => {
            const res = await request.put(url + ticket._id)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send(ticket_1.updatedTicketData());
            expect(res.body.message).toBe('Ticket updated successfully!');
            expect(res.body.ticket).toMatchObject({
                ...ticket_1.updatedTicketData(),
                id: ticket._id.toString()
            });
        });
    });
    describe('DELETE /api/v2/:projectId/ticket/:id', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            randomUser = await User_1.default.create(user_1.randomUserData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();
            ticket = new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id });
            project.tickets.push(ticket);
            // assign project with added ticket so that we can access ticket's id field
            project = await project.save();
            // using any since this only returns interface without methods and functions
            ticket = project.tickets[0];
        });
        it('returns status 401 (no token)', async () => {
            const res = await request.delete(url + ticket._id);
            expect(res.status).toBe(401);
        });
        it('returns status 404 (ticket not found)', async () => {
            ticket.remove();
            await project.save();
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(404);
        });
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(randomUser.generateToken()));
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        });
        it('returns status 403 (no permission)', async () => {
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(randomUser.generateToken()));
            expect(res.status).toBe(403);
        });
        it('returns status 403 (owner wants to delete ticket with status other than open', async () => {
            ticket.status = Ticket_1.TicketStatus.ACTIVE;
            await project.save();
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(403);
        });
        it('returns status 200 (owner deletes ticket that has status "open"', async () => {
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(200);
        });
        it('returns status 200 (support deletes ticket with status "open"', async () => {
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(editor.generateToken()));
            expect(res.status).toBe(200);
        });
        it('returns status 200 (support deletes ticket with status other than "open"', async () => {
            const activeTicket = new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id, status: 'active' });
            project.tickets.push(activeTicket);
            await project.save();
            await activeTicket.save();
            const res = await request.delete(url + activeTicket._id)
                .set(test_util_1.authHeaderObject(editor.generateToken()));
            expect(res.status).toBe(200);
        });
        it('returns deleted ticket', async () => {
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.body.ticket).toBeTruthy();
            expect(res.body.message).toBe('Ticket successfully deleted!');
        });
        it('deletes ticket from db', async () => {
            const res = await request.delete(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            const deletedTicket = await Ticket_1.default.findById(ticket._id);
            expect(deletedTicket).toBeFalsy();
        });
    });
    describe('GET /api/v2/:projectId/ticket/', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            project.tickets.push(new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            await project.save();
            ticket = project.tickets[0];
        });
        it('returns status 401 (no token)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        });
        it('returns status 200', async () => {
            const res = await request.get(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(200);
        });
        it('returns array of tickets and num of all tickets', async () => {
            const res = await request.get(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.body.tickets.length).toBe(1);
            expect(res.body.numAllTickets).toBe(1);
            expect(res.body.tickets[0].id).toBe(ticket._id.toHexString());
        });
        it('returns object with tickets per status', async () => {
            const res = await request.get(url)
                .set(test_util_1.authHeaderObject(owner.generateToken()))
                .query({ groupByStatus: true });
            expect(res.body.openTickets).toBeTruthy();
            expect(res.body.activeTickets).toBeTruthy();
            expect(res.body.closedTickets).toBeTruthy();
        });
    });
    describe('GET /api/v2/:projectId/ticket/:id', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            ticket = new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id, lastEditor: owner._id });
            project.tickets.push(ticket);
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('returns status 404 (ticket not found)', async () => {
            const id = new bson_1.ObjectID();
            const res = await request.get(url + id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(404);
        });
        it('returns status 200', async () => {
            const res = await request.get(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(200);
        });
        it('returns ticket', async () => {
            const res = await request.get(url + ticket._id)
                .set(test_util_1.authHeaderObject(owner.generateToken()));
            expect(res.body).toMatchObject({
                ...ticket_1.ticketData(), id: ticket._id.toString()
            });
        });
    });
    describe('PATCH /api/v2/:projectId/ticket/:id/status', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            randomUser = await User_1.default.create(user_1.randomUserData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();
            project.tickets.push(new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('returns status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + '/status').send({ status: Ticket_1.TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        });
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + '/status')
                .set(test_util_1.authHeaderObject(randomUser.generateToken()))
                .send({ status: Ticket_1.TicketStatus.ACTIVE });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        });
        it('return status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(test_util_1.authHeaderObject(randomUser.generateToken()))
                .send({ status: 'invalidStatus' });
            expect(res.status).toBe(422);
        });
        it('adds new history entry', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ ...ticket_1.ticketData(), status: Ticket_1.TicketStatus.CLOSED });
            expect(res.status).toBe(200);
            expect(res.body.ticket.editorHistory.length).toBe(ticket.editorHistory.length + 1);
        });
        it('returns status 200 (status changed)', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ status: Ticket_1.TicketStatus.ACTIVE });
            expect(res.status).toBe(200);
        });
    });
    describe('PATCH /api/v2/:projectId/ticket/:id/sub-task', () => {
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            randomUser = await User_1.default.create(user_1.randomUserData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();
            project.tickets.push(new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('return status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task').send({ status: Ticket_1.TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        });
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(test_util_1.authHeaderObject(randomUser.generateToken()))
                .send({ subTasks: ticket_1.subTasksData() });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        });
        it('returns status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ subTasks: [{ description: 'desc', isDone: 'invalidValue' }] });
            expect(res.status).toBe(422);
        });
        it('returns status 200', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ subTasks: ticket_1.subTasksData() });
            expect(res.status).toBe(200);
        });
    });
    describe('PATCH /api/v2/:projectId/ticket/:id/title', () => {
        const subUrl = '/title';
        beforeEach(async () => {
            owner = await User_1.default.create(user_1.ownerData());
            editor = await User_1.default.create(user_1.editorData());
            randomUser = await User_1.default.create(user_1.randomUserData());
            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            await project.save();
            project.tickets.push(new Ticket_1.default({ ...ticket_1.ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0];
        });
        it('return status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + subUrl).send({ status: Ticket_1.TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        });
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + subUrl)
                .set(test_util_1.authHeaderObject(randomUser.generateToken()))
                .send({ title: 'validTitle' });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        });
        it('returns status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ title: 'iv' }); // invalid title
            expect(res.status).toBe(422);
        });
        it('adds new history entry', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ ...ticket_1.ticketData(), title: 'updatedTitle' });
            expect(res.status).toBe(200);
            expect(res.body.ticket.editorHistory.length).toBe(ticket.editorHistory.length + 1);
        });
        it('returns status 200', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ title: 'validTitle' });
            expect(res.status).toBe(200);
        });
        it('changed title', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(test_util_1.authHeaderObject(editor.generateToken()))
                .send({ title: 'validTitle' });
            const updatedProject = await Project_1.ProjectModel.findOne({ 'tickets._id': ticket._id });
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].title).toBe('validTitle');
        });
    });
});
//# sourceMappingURL=ticket.test.js.map