import { TicketController } from "./ticket";
import { SuperTest, Test } from "supertest";
import { setupDB } from "../../startup/testSetup";
import { TestServer } from "../../TestServer";
import supertest from "supertest";
import { IUser, ERole } from "../../models/User";
import UserModel from "../../models/User";
import TicketModel, { ITicket, TicketStatus } from "../../models/Ticket";
import { ObjectID } from "bson";


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

    const ownerMock = {
        firstName: 'Joe',
        lastName: 'Mama',
        email: 'owner@mail.com',
        password: 'password'
    }

    const editorMock = {
        firstName: 'Editor',
        lastName: 'Rian',
        email: 'editor@mail.com',
        password: 'password',
        roles: [ERole.Support]
    }

    const ticketMock = {
        title: 'Something does not work',
        description: 'A sample ticket',
        priority: 0,
        criticality: 0
    }

    describe('POST /api/ticket', () => {

        const url = '/api/ticket';
        let owner: IUser;
        let editor: IUser;

        let authHeaders: Object;

        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            editor = await UserModel.create(editorMock);

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('returns status 401 (no token)', async () => {
            const res = await request
            .post(url)
            .send(ticketMock);
        expect(res.status).toBe(401);
        })

        it('returns status 201', async () => {
            const res = await request
                .post(url)
                .set(authHeaders)
                .send(ticketMock);
            expect(res.status).toBe(201);
        })

        it('returns newly created ticket', async () => {
            const res = await request
                .post(url)
                .set(authHeaders)
                .send(ticketMock);

            expect(res.body.message).toBe('Ticket successfully created!');
            expect(res.body.ticket).toMatchObject({
                ...ticketMock,
                ownerId: owner._id.toHexString()
            });
        })

        it('created new ticket in db', async () => {
            const res = await request.post(url).send(ticketMock);
            const ticket = await TicketModel.find({title: ticketMock.title});
            expect(ticket).toBeTruthy();
        })

    })

    describe('PUT /api/ticket/:id', () => {
        const url = '/api/ticket/';
        let owner: IUser;
        let editor: IUser;
        let authHeaders: Object;

        let ticket: ITicket;

        const updatedTicketMock = {
            title: 'updated title',
            description: 'updated description',
            priority: 1,
            criticality: 2,
            status: TicketStatus.ACTIVE
        }

        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            editor = await UserModel.create(editorMock);

            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.put(url + ticket._id)
            .send(updatedTicketMock);
            expect(res.status).toBe(401);
        })

        it('returns status 403 (user does not have support-role)', async () => {
            const res = await request.put(url + ticket._id)
            .set(authHeaders)
            .send(updatedTicketMock);
            expect(res.status).toBe(403);
        })

        it('returns status 404 (ticket does not exist)', async () => {
            const invalidId = new ObjectID();
            const res = await request.put(url + invalidId)
            .set({Authorization: 'Bearer ' + editor.generateToken()})
            .send(updatedTicketMock);
            expect(res.status).toBe(404);
        })

        it('returns status 200', async () => {
            const res = await request.put(url + ticket._id)
            .set({Authorization: 'Bearer ' + editor.generateToken()})
            .send(updatedTicketMock);
            expect(res.status).toBe(200);
        })

        it('returns message and ticket', async () => {
            const res = await request.put(url + ticket._id)
            .set({Authorization: 'Bearer ' + editor.generateToken()})
            .send(updatedTicketMock);
            expect(res.body.message).toBe('Ticket updated successfully!');
            expect(res.body.ticket).toMatchObject({
                ...updatedTicketMock,
                id: ticket._id.toString()
            })
        })
    })
    
    describe('DELETE /api/ticket/:id', () => {

        const randomUserMock = {
            firstName: 'Random',
            lastName: 'User',
            email: 'randomuser@mail.com',
            password: 'password'
        }

        const url = '/api/ticket/';
        let owner: IUser;
        let editor: IUser;
        let randomUser: IUser;

        let ticket: ITicket;

        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            editor = await UserModel.create(editorMock);
            randomUser = await UserModel.create(randomUserMock);

            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});

        })

        it('returns status 401 (no token)', async () => {
            const res = await request.delete(url + ticket._id)
            expect(res.status).toBe(401);
        }),
        
        it('returns status 404 (ticket not found)', async () => {
            await TicketModel.findByIdAndRemove(ticket._id);
            const res = await request.delete(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()});
            expect(res.status).toBe(404);
        })

        it('returns status 403 (no permission)', async () => {
            const res = await request.delete(url + ticket._id)
            .set({Authorization: 'Bearer ' + randomUser.generateToken()});
            expect(res.status).toBe(403);
        }),

        it('returns status 403 (owner wants to delete ticket with status other than open', async () => {
            ticket.status = TicketStatus.ASSIGNED;
            await ticket.save();
            const res = await request.delete(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()});
            expect(res.status).toBe(403);
        }),


        it('returns status 200', async () => {
            const res = await request.delete(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()});
            expect(res.status).toBe(200);
        })

        it('returns deleted ticket', async () => {
            const res = await request.delete(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()});
            expect(res.body.ticket).toBeTruthy();
            expect(res.body.message).toBe('Ticket successfully deleted!');
        })

    }),
    
    describe('GET /api/ticket/', () => {

        const url = '/api/ticket/';
        let owner: IUser;
        let ticket: ITicket;

        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});
        })

        it('returns status 401 (no token)', async () => {
            const res = await request.get(url);
            expect(res.status).toBe(401);
        })

        it('returns array of tickets', async () => {
            const res = await request.get(url)
            .set({Authorization: 'Bearer ' + owner.generateToken()});
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBe(ticket._id.toHexString())
        })
    })

    describe('GET /api/ticket/:id', () => {
        
        const url = '/api/ticket/';
        let owner: IUser;
        let ticket: ITicket;
        
        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});
        })
        
        it('returns status 404 (ticket not found)', async () => {
            const id = new ObjectID();
            const res = await request.get(url + id)
            .set({Authorization: 'Bearer ' + owner.generateToken()})
            expect(res.status).toBe(404);
        })
        
        it('returns status 200', async () => {
            const res = await request.get(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()})
            expect(res.status).toBe(200);
        })
        
        it('returns ticket', async () => {
            const res = await request.get(url + ticket._id)
            .set({Authorization: 'Bearer ' + owner.generateToken()})
            expect(res.body).toMatchObject({
                ...ticketMock, id: ticket._id.toString()
            });
        })
    })
    
})