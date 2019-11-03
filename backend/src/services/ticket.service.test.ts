import { TicketService } from "./ticket.service";
import { setupDB } from "../startup/testSetup";
import { ERole, IUser } from "../models/User";
import TicketModel, { ITicket, ticketSchema } from "../models/Ticket";
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
        priority: 0,
        criticality: 0
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
            priority: 1,
            criticality: 2,
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
            await expect(ticketService.updateTicket(id, editor._id, ticket.toJSON())).rejects.toThrow('Ticket not found!');
        })
    
        it('returns updated ticket', async () => {
            const updatedTicket = await ticketService.updateTicket(ticket._id, editor._id, updatedTicketMock);
            expect(updatedTicket).toMatchObject(updatedTicketMock);
            expect(updatedTicket.lastEditorId).toBe(editor._id);
            expect(updatedTicket.editorIds).toContain(editor._id);
        })
    })
})