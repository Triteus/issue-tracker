import { TicketController } from "./ticket";
import { SuperTest, Test } from "supertest";
import { setupDB } from "../../startup/testSetup";
import { TestServer } from "../../TestServer";
import supertest from "supertest";
import { IUser, ERole } from "../../models/User";
import UserModel from "../../models/User";
import TicketModel, { ITicket, TicketStatus, Priority, ITicketDocument } from "../../models/Ticket";
import { ObjectID } from "bson";
import { ticketData, updatedTicketData, subTasksData } from "../../test-data/ticket"
import { ownerData, editorData, randomUserData } from "../../test-data/user";
import { ProjectController } from "../v2/project/project";
import { IProject, ProjectModel } from "../../models/Project";
import { projectData } from "../../test-data/project";
import { authHeaderObject } from "../../util/test-util";


describe('TicketController', () => {

    const projectController = new ProjectController();
    let request: SuperTest<Test>;

    setupDB('test-ticket-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(projectController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    let owner: IUser;
    let editor: IUser;
    let randomUser: IUser;
    let ticket: ITicket;
    let project: IProject;

    const baseUrl = "/api/v2";
    let url = '';

    beforeEach(async () => {
        project = await ProjectModel.create(projectData());
        url = `${baseUrl}/project/${project._id}/ticket/`;
    })

    describe('POST /api/v2/:projectId/ticket', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            await project.save();
        })

        it('returns status 401 (no token)', async () => {
            const res = await request
                .post(url)
                .send(ticketData());
            expect(res.status).toBe(401);
        })

        it('returns status 422 (validator)', async () => {
            const res = await request
                .post(url)
                .set(authHeaderObject(owner.generateToken()))
                .send({ ...ticketData(), status: 'invalidStatus' });
            expect(res.status).toBe(422);
        })

        it('returns status 201', async () => {
            const res = await request
                .post(url)
                .set(authHeaderObject(owner.generateToken()))
                .send(ticketData());
            expect(res.status).toBe(201);
        })

        it('returns newly created ticket', async () => {
            const res = await request
                .post(url)
                .set(authHeaderObject(owner.generateToken()))
                .send(ticketData());

            expect(res.body.message).toBe('Ticket successfully created!');
            expect(res.body.ticket).toMatchObject({
                ...ticketData(),
                owner: owner._id.toHexString()
            });
        })

        it('created new ticket in db', async () => {
            const res = await request.post(url).send(ticketData());
            const ticket = await TicketModel.find({ title: ticketData().title });
            expect(ticket).toBeTruthy();
        })

    })

    describe('PUT /api/v2/:projectId/ticket/:id', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();
            
            ticket = new TicketModel({ ...ticketData(), owner: owner._id });
            project.tickets.push(ticket);
            await project.save();

        })

        it('returns status 401 (no token)', async () => {
            const res = await request.put(url + ticket._id)
                .send(updatedTicketData());
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);

            const res = await request.put(url + ticket._id)
                .set(authHeaderObject(randomUser.generateToken()))
                .send(updatedTicketData());
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        })
        
        it('returns status 403 (user does not have support-role)', async () => {
            const res = await request.put(url + ticket._id)
                .set(authHeaderObject(randomUser.generateToken()))
                .send(updatedTicketData());
            expect(res.status).toBe(403);
        })

        it('returns status 404 (ticket does not exist)', async () => {
            const invalidId = new ObjectID();
            const res = await request.put(url + invalidId)
                .set(authHeaderObject(editor.generateToken()))
                .send(updatedTicketData());
            expect(res.status).toBe(404);
        })

        it('returns status 200', async () => {
            const res = await request.put(url + ticket._id)
                .set(authHeaderObject(editor.generateToken()))
                .send(updatedTicketData());
            expect(res.status).toBe(200);
        })

        it('returns message and ticket', async () => {
            const res = await request.put(url + ticket._id)
                .set(authHeaderObject(editor.generateToken()))
                .send(updatedTicketData());
            expect(res.body.message).toBe('Ticket updated successfully!');
            expect(res.body.ticket).toMatchObject({
                ...updatedTicketData(),
                id: ticket._id.toString()
            })
        })
    })

    describe('DELETE /api/v2/:projectId/ticket/:id', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();

            ticket = new TicketModel({ ...ticketData(), owner: owner._id });
            project.tickets.push(ticket);
            // assign project with added ticket so that we can access ticket's id field
            project = await project.save();
            // using any since this only returns interface without methods and functions
            ticket = <any>project.tickets[0];
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.delete(url + ticket._id)
            expect(res.status).toBe(401);
        })

        it('returns status 404 (ticket not found)', async () => {
            ticket.remove();
            await project.save();
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(404);
        })
      
        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id)
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(randomUser.generateToken()));
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        })

        it('returns status 403 (no permission)', async () => {
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(randomUser.generateToken()));
            expect(res.status).toBe(403);
        })


        it('returns status 403 (owner wants to delete ticket with status other than open', async () => {
            ticket.status = TicketStatus.ACTIVE;
            await project.save();
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(403);
        })

        it('returns status 200 (owner deletes ticket that has status "open"', async () => {
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(200);
        })

        it('returns status 200 (support deletes ticket with status "open"', async () => {
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(editor.generateToken()));
            expect(res.status).toBe(200);
        })

        it('returns status 200 (support deletes ticket with status other than "open"', async () => {
            const activeTicket = new TicketModel({ ...ticketData(), owner: owner._id, status: 'active' });
            project.tickets.push(activeTicket);
            await project.save();
            await activeTicket.save();
            const res = await request.delete(url + activeTicket._id)
                .set(authHeaderObject(editor.generateToken()));
            expect(res.status).toBe(200);
        })

        it('returns deleted ticket', async () => {
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.body.ticket).toBeTruthy();
            expect(res.body.message).toBe('Ticket successfully deleted!');
        })

        it('deletes ticket from db', async () => {
            const res = await request.delete(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()));

            const deletedTicket = await TicketModel.findById(ticket._id);
            expect(deletedTicket).toBeFalsy();
        })

    })

    describe('GET /api/v2/:projectId/ticket/', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            project.tickets.push(new TicketModel({ ...ticketData(), owner: owner._id }));
            await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        })

        it('returns status 200', async () => {
            const res = await request.get(url)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.status).toBe(200);
        })

        it('returns array of tickets and num of all tickets', async () => {
            const res = await request.get(url)
                .set(authHeaderObject(owner.generateToken()));
            expect(res.body.tickets.length).toBe(1);
            expect(res.body.numAllTickets).toBe(1);
            expect(res.body.tickets[0]._id).toBe(ticket._id.toHexString())
        })

        it('returns object with tickets per status', async () => {
            const res = await request.get(url)
                .set(authHeaderObject(owner.generateToken()))
                .query({ groupByStatus: true });
            expect(res.body.openTickets).toBeTruthy();
            expect(res.body.activeTickets).toBeTruthy();
            expect(res.body.closedTickets).toBeTruthy();
        })
    })

    describe('GET /api/v2/:projectId/ticket/:id', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            ticket = new TicketModel({ ...ticketData(), owner: owner._id, lastEditor: owner._id });
            project.tickets.push(ticket);
            project = await project.save();
            ticket = <any>project.tickets[0];
        })

        it('returns status 404 (ticket not found)', async () => {
            const id = new ObjectID();
            const res = await request.get(url + id)
                .set(authHeaderObject(owner.generateToken()))
            expect(res.status).toBe(404);
        })

        it('returns status 200', async () => {
            const res = await request.get(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()))
            expect(res.status).toBe(200);
        })

        it('returns ticket', async () => {
            const res = await request.get(url + ticket._id)
                .set(authHeaderObject(owner.generateToken()))
            expect(res.body).toMatchObject({
                ...ticketData(), id: ticket._id.toString()
            });
        })
    })

    describe('PATCH /api/v2/:projectId/ticket/:id/status', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();

            project.tickets.push(new TicketModel({ ...ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + '/status').send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + '/status')
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        })

        it('returns 403 (user has no "support"-role)', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(403);
        })

        it('return status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ status: 'invalidStatus' });
            expect(res.status).toBe(403);
        })

        it('returns status 200 (status changed)', async () => {
            const res = await request.patch(url + ticket._id + '/status')
                .set(authHeaderObject(editor.generateToken()))
                .send({ status: TicketStatus.ACTIVE })
            expect(res.status).toBe(200);
        })
    })

    describe('PATCH /api/v2/:projectId/ticket/:id/sub-task', () => {

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            project.addUserToProject(randomUser._id);
            await project.save();

            project.tickets.push(new TicketModel({ ...ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('return status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task').send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ subTasks: subTasksData() });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i);
        })
        it('returns status 403 (no support role)', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ subTasks: subTasksData() });
            expect(res.status).toBe(403);
        })

        it('returns status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(authHeaderObject(editor.generateToken()))
                .send({ subTasks: [{ description: 'desc', isDone: 'invalidValue' }] });
            expect(res.status).toBe(422);
        })

        it('returns status 200', async () => {
            const res = await request.patch(url + ticket._id + '/sub-task')
                .set(authHeaderObject(editor.generateToken()))
                .send({ subTasks: subTasksData() });
            expect(res.status).toBe(200);
        })
    })

    describe('PATCH /api/v2/:projectId/ticket/:id/title', () => {
        const subUrl = '/title';

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());

            project.addUserToProject(owner._id);
            project.addUserToProject(editor._id);
            await project.save();

            project.tickets.push(new TicketModel({ ...ticketData(), owner: owner._id }));
            project = await project.save();
            ticket = project.tickets[0] as ITicket;
        })

        it('return status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + subUrl).send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user not assigned to project)', async () => {
            await project.removeUserFromProjectAndSave(randomUser._id);
            const res = await request.patch(url + ticket._id + subUrl)
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ title: 'validTitle' });
            expect(res.status).toBe(403);
            expect(res.body.error).toMatch(/not assigned to project/i)
        })

        it('returns status 403 (no support role)', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(authHeaderObject(randomUser.generateToken()))
                .send({ title: 'validTitle' });
            expect(res.status).toBe(403);
        })

        it('returns status 422 (validator)', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(authHeaderObject(editor.generateToken()))
                .send({ title: 'iv' }); // invalid title
            expect(res.status).toBe(422);
        })

        it('returns status 200', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(authHeaderObject(editor.generateToken()))
                .send({ title: 'validTitle' });
            expect(res.status).toBe(200);
        })

        it('changed title', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set(authHeaderObject(editor.generateToken()))
                .send({ title: 'validTitle' });
            const updatedProject = await ProjectModel.findOne({ 'tickets._id': ticket._id })
            expect(updatedProject).toBeTruthy();
            expect(updatedProject.tickets[0].title).toBe('validTitle');
        })
    })
})