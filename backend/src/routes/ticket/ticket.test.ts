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


function createBearerToken(token: string) {
    return 'Bearer ' + token;
}

describe('TicketController', () => {

    const ticketController = new TicketController();
    let request: SuperTest<Test>;

    setupDB('test-ticket-controller');

    beforeAll(async (done) => {
        const testServer = new TestServer();
        testServer.setControllers(ticketController);
        request = supertest(testServer.getExpressInstance());
        done();
    })

    let owner: IUser;
    let editor: IUser;
    let randomUser: IUser;
    let ticket: ITicket;
    let updatedTicket: ITicket;

    let token: string;

    describe('POST /api/ticket', () => {

        const url = '/api/ticket';

        let authHeaders: Object;

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('returns status 401 (no token)', async () => {
            const res = await request
                .post(url)
                .send(ticketData());
            expect(res.status).toBe(401);
        })

        it('returns status 201', async () => {
            const res = await request
                .post(url)
                .set(authHeaders)
                .send(ticketData());
            expect(res.status).toBe(201);
        })

        it('returns newly created ticket', async () => {
            const res = await request
                .post(url)
                .set(authHeaders)
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

    describe('PUT /api/ticket/:id', () => {
        const url = '/api/ticket/';
        let authHeaders: Object;

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.put(url + ticket._id)
                .send(updatedTicketData());
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user does not have support-role)', async () => {
            const res = await request.put(url + ticket._id)
                .set(authHeaders)
                .send(updatedTicketData());
            expect(res.status).toBe(403);
        })

        it('returns status 404 (ticket does not exist)', async () => {
            const invalidId = new ObjectID();
            const res = await request.put(url + invalidId)
                .set({ Authorization: 'Bearer ' + editor.generateToken() })
                .send(updatedTicketData());
            expect(res.status).toBe(404);
        })

        it('returns status 200', async () => {
            const res = await request.put(url + ticket._id)
                .set({ Authorization: 'Bearer ' + editor.generateToken() })
                .send(updatedTicketData());
            expect(res.status).toBe(200);
        })

        it('returns message and ticket', async () => {
            const res = await request.put(url + ticket._id)
                .set({ Authorization: 'Bearer ' + editor.generateToken() })
                .send(updatedTicketData());
            expect(res.body.message).toBe('Ticket updated successfully!');
            expect(res.body.ticket).toMatchObject({
                ...updatedTicketData(),
                id: ticket._id.toString()
            })
        })
    })

    describe('DELETE /api/ticket/:id', () => {

        const url = '/api/ticket/';

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            randomUser = await UserModel.create(randomUserData());
            ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.delete(url + ticket._id)
            expect(res.status).toBe(401);
        }),

            it('returns status 404 (ticket not found)', async () => {
                await TicketModel.findByIdAndRemove(ticket._id);
                const res = await request.delete(url + ticket._id)
                    .set({ Authorization: 'Bearer ' + owner.generateToken() });
                expect(res.status).toBe(404);
            })

        it('returns status 403 (no permission)', async () => {
            const res = await request.delete(url + ticket._id)
                .set({ Authorization: 'Bearer ' + randomUser.generateToken() });
            expect(res.status).toBe(403);
        }),

            it('returns status 403 (owner wants to delete ticket with status other than open', async () => {
                ticket.status = TicketStatus.ACTIVE;
                await ticket.save();
                const res = await request.delete(url + ticket._id)
                    .set({ Authorization: 'Bearer ' + owner.generateToken() });
                expect(res.status).toBe(403);
            }),


            it('returns status 200', async () => {
                const res = await request.delete(url + ticket._id)
                    .set({ Authorization: 'Bearer ' + owner.generateToken() });
                expect(res.status).toBe(200);
            })

        it('returns deleted ticket', async () => {
            const res = await request.delete(url + ticket._id)
                .set({ Authorization: 'Bearer ' + owner.generateToken() });
            expect(res.body.ticket).toBeTruthy();
            expect(res.body.message).toBe('Ticket successfully deleted!');
        })

    })

    describe('GET /api/ticket/', () => {

        const url = '/api/ticket';

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        })

        it('returns array of tickets', async () => {
            const res = await request.get(url)
                .set({ Authorization: 'Bearer ' + owner.generateToken() });
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBe(ticket._id.toHexString())
        })

        it('returns object with tickets per status', async () => {
            const res = await request.get(url)
            .set({ Authorization: 'Bearer ' + owner.generateToken() })
            .query({groupByStatus: true});
            expect(res.body.openTickets).toBeTruthy();
            expect(res.body.activeTickets).toBeTruthy();
            expect(res.body.closedTickets).toBeTruthy();
        })
    })

    describe('GET /api/ticket/:id', () => {

        const url = '/api/ticket/';

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
        })

        it('returns status 404 (ticket not found)', async () => {
            const id = new ObjectID();
            const res = await request.get(url + id)
                .set({ Authorization: 'Bearer ' + owner.generateToken() })
            expect(res.status).toBe(404);
        })

        it('returns status 200', async () => {
            const res = await request.get(url + ticket._id)
                .set({ Authorization: 'Bearer ' + owner.generateToken() })
            expect(res.status).toBe(200);
        })

        it('returns ticket', async () => {
            const res = await request.get(url + ticket._id)
                .set({ Authorization: 'Bearer ' + owner.generateToken() })
            expect(res.body).toMatchObject({
                ...ticketData(), id: ticket._id.toString()
            });
        })
    }),

        describe('PATCH /api/ticket/:id/status', () => {
            const url = '/api/ticket/'

            beforeEach(async () => {
                owner = await UserModel.create(ownerData());
                editor = await UserModel.create(editorData());
                randomUser = await UserModel.create(randomUserData());
                ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
            })

            it('returns status 401 (no token)', async () => {
                const res = await request.patch(url + ticket._id + '/status').send({ status: TicketStatus.ACTIVE });
                expect(res.status).toBe(401);
            })

            it('returns 403 (user has no "support"-role)', async () => {
                const res = await request.patch(url + ticket._id + '/status')
                    .set({ Authorization: 'Bearer ' + randomUser.generateToken() })
                    .send({ status: TicketStatus.ACTIVE });
                expect(res.status).toBe(403);
            })

            it('returns status 200 (status changed)', async () => {
                const res = await request.patch(url + ticket._id + '/status')
                    .set({ Authorization: 'Bearer ' + editor.generateToken() })
                    .send({ status: TicketStatus.ACTIVE })
                expect(res.status).toBe(200);
            })
        }),

        describe('PATCH /api/ticket/:id/sub-task', () => {

            const url = '/api/ticket/'

            beforeEach(async () => {
                owner = await UserModel.create(ownerData());
                editor = await UserModel.create(editorData());
                ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
            })

            it('return status 401 (no token)', async () => {
                const res = await request.patch(url + ticket._id + '/sub-task').send({ status: TicketStatus.ACTIVE });
                expect(res.status).toBe(401);
            })

            it('returns status 403 (no support role)', async () => {
                const res = await request.patch(url + ticket._id + '/sub-task')
                    .set({ Authorization: 'Bearer ' + owner.generateToken() })
                    .send({ subTasks: subTasksData() });
                expect(res.status).toBe(403);
            })

            it('returns status 200', async () => {
                const res = await request.patch(url + ticket._id + '/sub-task')
                    .set({ Authorization: 'Bearer ' + editor.generateToken() })
                    .send({ subTasks: subTasksData() });
                expect(res.status).toBe(200);
            })
        })

    describe('PATCH /api/ticket/:id/title', () => {
        const url = '/api/ticket/';
        const subUrl = '/title';

        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({ ...ticketData(), owner: owner._id });
        })

        it('return status 401 (no token)', async () => {
            const res = await request.patch(url + ticket._id + subUrl).send({ status: TicketStatus.ACTIVE });
            expect(res.status).toBe(401);
        })

        it('returns status 403 (no support role)', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set({ Authorization: 'Bearer ' + owner.generateToken() })
                .send({ title: 'validTitle' });
            expect(res.status).toBe(403);
        })

        it('returns status 200', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set({ Authorization: 'Bearer ' + editor.generateToken() })
                .send({ title: 'validTitle' });
            expect(res.status).toBe(200);
        })

        it('changed title', async () => {
            const res = await request.patch(url + ticket._id + subUrl)
                .set({ Authorization: 'Bearer ' + editor.generateToken() })
                .send({ title: 'validTitle' });
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.title).toBe('validTitle');
        })
    })
})