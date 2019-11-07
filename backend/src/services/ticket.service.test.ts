import { TicketService } from "./ticket.service";
import { setupDB } from "../startup/testSetup";
import { ERole, IUser } from "../models/User";
import TicketModel, { ITicket, ticketSchema, TicketStatus, Priority } from "../models/Ticket";
import UserModel from "../models/User";
import { ObjectID } from "bson";
import { ownerData, editorData } from "../test-data/user";
import { ticketData, subTasksData, updatedTicketData } from "../test-data/ticket";

describe('TicketService', () => {

    const ticketService = new TicketService();

    setupDB('test-ticket-service');

    let owner: IUser;
    let editor: IUser;
    let ticket: ITicket;

    describe('create ticket', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
        })

        it('created new ticket', async () => {
            const ticket = await ticketService.createTicket(owner._id, ticketData());
            expect(ticket.toJSON()).toMatchObject(ticketData());
        })

        it('saves ticket in db', async () => {
            await ticketService.createTicket(owner._id, ticketData());
            const ticket = await TicketModel.findOne({ownerId: owner._id});
            expect(ticket).toBeTruthy();
            expect(ticket.toJSON()).toMatchObject(ticketData());
        })

    })

    describe('update ticket', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({...ticketData(), ownerId: owner._id});
        })

        it('throws ResponseError (ticket not found)', async () => {
            const id = new ObjectID();
            await expect(ticketService.findAndUpdateTicket(id, editor._id, ticket.toJSON())).rejects.toThrow('Ticket not found!');
        })
    
        it('returns updated ticket', async () => {
            const updatedTicket = await ticketService.findAndUpdateTicket(ticket._id, editor._id, updatedTicketData());
            const {subTasks, ...expectedPayload } = updatedTicketData();
            expect(updatedTicket.toJSON()).toMatchObject(expectedPayload);
            // check if editor was changed
            expect(updatedTicket.lastEditorId).toBe(editor._id);
            expect(updatedTicket.editorIds).toContain(editor._id);
            // check if subtasks were changed
            expect(updatedTicket.subTasks.length).toBe(subTasksData().length);
            updatedTicket.subTasks.forEach((subTask, index) => {
                expect(subTask).toMatchObject(subTasksData()[index]);
            })
        })
    }),

    describe('change status', () => {      
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());

            ticket = await TicketModel.create({...ticketData(), ownerId: owner._id});
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
    }),

    describe('change sub-tasks', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({...ticketData(), ownerId: owner._id});
        })

        it('throws error (ticket not found)', async () => {
            await expect(ticketService.findTicketAndChangeSubTasks(new ObjectID(), subTasksData(), editor._id)).rejects.toThrow('Ticket not found!');
        })

        it('updated sub-tasks in db', async () => {
            await ticketService.findTicketAndChangeSubTasks(ticket._id, subTasksData(), editor._id);
            const updatedTicket = await TicketModel.findById(ticket._id);
            updatedTicket.subTasks.forEach((subTask, index) => {
                expect(subTask).toMatchObject(subTasksData()[index]);
            })
        })
    })
})