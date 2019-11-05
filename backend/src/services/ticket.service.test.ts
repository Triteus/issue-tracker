import { TicketService } from "./ticket.service";
import { setupDB } from "../startup/testSetup";
import { ERole, IUser } from "../models/User";
import TicketModel, { ITicket, ticketSchema, TicketStatus, Priority } from "../models/Ticket";
import UserModel from "../models/User";
import { ObjectID } from "bson";

describe('TicketService', () => {

    const ticketService = new TicketService();

    setupDB('test-ticket-service');

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
        priority: Priority.HIGH,
        neededAt: new Date()
    }

    describe('create ticket', () => {
        let owner: IUser;
        let authHeaders: Object;
    
      
        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
        
            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('created new ticket', async () => {
            const ticket = await ticketService.createTicket(owner._id, ticketMock);
            expect(ticket).toMatchObject(ticketMock);
        })

        it('saves ticket in db', async () => {
            await ticketService.createTicket(owner._id, ticketMock);
            const ticket = await TicketModel.findOne({ownerId: owner._id});
            expect(ticket).toBeTruthy();
            expect(ticket).toMatchObject(ticketMock);
        })

    })

    describe('update ticket', () => {
        let owner: IUser;
        let editor: IUser;
        let authHeaders: Object;

        let ticket: ITicket;

        const updatedTicketMock = {
            title: 'updated title',
            description: 'updated description',
            priority: Priority.VERY_HIGH,
            neededAt: new Date(),
        }

        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            editor = await UserModel.create(editorMock);

            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })


        it('throws ResponseError (ticket not found)', async () => {
            const id = new ObjectID();
            await expect(ticketService.findAndUpdateTicket(id, editor._id, ticket.toJSON())).rejects.toThrow('Ticket not found!');
        })
    
        it('returns updated ticket', async () => {
            const updatedTicket = await ticketService.findAndUpdateTicket(ticket._id, editor._id, updatedTicketMock);
            expect(updatedTicket).toMatchObject(updatedTicketMock);
            expect(updatedTicket.lastEditorId).toBe(editor._id);
            expect(updatedTicket.editorIds).toContain(editor._id);
        })
    }),

    describe('change status', () => {
        let owner: IUser;
        let editor: IUser;
        let authHeaders: Object;

        let ticket: ITicket;

      
        beforeEach(async () => {
            owner = await UserModel.create(ownerMock);
            editor = await UserModel.create(editorMock);

            ticket = await TicketModel.create({...ticketMock, ownerId: owner._id});

            authHeaders = {
                Authorization: 'Bearer ' + owner.generateToken()
            }
        })

        it('throws error (ticket not found)', async () => {
            const id = new ObjectID();
            await expect(ticketService.findTicketAndChangeStatus(TicketStatus.ACTIVE, id, new ObjectID()))
            .rejects.toThrow('Ticket not found!');
        })

        it('changed status of ticket', async () => {
            await ticketService.findTicketAndChangeStatus(TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.status).toBe(TicketStatus.ACTIVE);
        })

        it('assigns editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.assignedTo).toStrictEqual(editor._id);
        })

        it('removes assigned user from ticket (status switches to closed', async () => {
            await ticketService.findTicketAndChangeStatus(TicketStatus.CLOSED, ticket._id, editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.assignedTo).toBeFalsy();
        })

        it('removes assigned user from ticket (status switches to open', async () => {
            await ticketService.findTicketAndChangeStatus(TicketStatus.OPEN, ticket._id, editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.assignedTo).toBeFalsy();
        })

        it('added editor to ticket', async () => {
            await ticketService.findTicketAndChangeStatus(TicketStatus.ACTIVE, ticket._id, editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            expect(updatedTicket.lastEditorId).toStrictEqual(editor._id);
            expect(updatedTicket.editorIds).toContainEqual(editor._id);
        })
    })
})