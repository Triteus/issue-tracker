import { TicketService, sort, filter, pagination } from "./ticket.service";
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
    
    describe('get tickets', () => {
        
        let openTicket: ITicket, activeTicket: ITicket, closedTicket: ITicket;
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            openTicket = await TicketModel.create({...ticketData(), status: TicketStatus.OPEN, owner: owner._id});
            activeTicket = await TicketModel.create({...ticketData(), status: TicketStatus.ACTIVE, owner: owner._id});
            closedTicket = await TicketModel.create({...ticketData(), status: TicketStatus.CLOSED, owner: owner._id});
        })

        it('should get tickets grouped by status', async () => {
            const ticketsByStatus = await ticketService.findAndGroupTicketsByStatus({});
            expect(ticketsByStatus.openTickets[0]._id).toEqual(openTicket._id);
            expect(ticketsByStatus.activeTickets[0]._id).toEqual(activeTicket._id);
            expect(ticketsByStatus.closedTickets[0]._id).toEqual(closedTicket._id);
        })

    })

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
            const ticket = await TicketModel.findOne({owner: owner._id});
            expect(ticket).toBeTruthy();
            expect(ticket.toJSON()).toMatchObject(ticketData());
        })

    })

    describe('update ticket', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({...ticketData(), owner: owner._id});
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
            expect(updatedTicket.lastEditor).toBe(editor._id);
            expect(updatedTicket.editors).toContain(editor._id);
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

            ticket = await TicketModel.create({...ticketData(), owner: owner._id});
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
            expect(updatedTicket.lastEditor).toStrictEqual(editor._id);
            expect(updatedTicket.editors).toContainEqual(editor._id);
        })
    }),

    describe('change sub-tasks', () => {
        beforeEach(async () => {
            owner = await UserModel.create(ownerData());
            editor = await UserModel.create(editorData());
            ticket = await TicketModel.create({...ticketData(), owner: owner._id});
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

    describe('sorting', () => {
        it('returns empty object if sortBy is undefined', () => {
            const res = sort({sortDir: 'asc'});
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();
        })
        it('returns empty object if sortBy or sortDir is undefined', () => {
            const res = sort({sortBy: 'status'});
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();
        })
        it('returns empty object if sortDir is invalid', () => {
            const res = sort({sortBy: 'status', sortDir: 'sdfsdfsd'});
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();  
        })
        
        it('returns object [sortBy]: -1', () => {
            const res = sort({sortBy: 'status', sortDir: 'desc'});
            expect(res['status']).toBeTruthy();  
            expect(res['status']).toBe(-1);
            
        })
        it('returns object [sortBy]: 1', () => {
            const res = sort({sortBy: 'status', sortDir: 'asc'});
            expect(res['status']).toBeTruthy();  
            expect(res['status']).toBe(1);
        })
    })
    describe('filtering', () => {
        it('returns object with status (selectors undefined)', () => {
            const res = filter({});
            expect(res['status']).toEqual({$in: ['open', 'active', 'closed']});
        })
        
        it('returns object with updatedAt default values', () => {
            const res = filter({});
            expect(res['updatedAt']).toBeTruthy();
            expect(res.updatedAt.$gte).toBe(0);
            expect(res.updatedAt.$lte).toBeTruthy();
        })
        it('returns systems array (all values lowercase)', () => {
            const res = filter({systems: ['JIRA', 'CONFLUENCE', 'OUTLOOK']});
            expect(res['affectedSystems']).toEqual({$in: ['jira', 'confluence', 'outlook']});
        })

    })
    describe('pagination', () => {
        it('returns empty object (pageIndex undefined)', () => {
            const res = pagination({pageSize: 20});
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        it('returns empty object (pageIndex < 0)', () => {
            const res = pagination({pageIndex: -1, pageSize: 20});
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        
        it('return empty object (pageSize undefined)', () => {
            const res = pagination({pageIndex: 20});
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        it('return empty object (pageSize < 0)', () => {
            const res = pagination({pageSize: -1, pageIndex: 2});
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        
        it('returns pageIndex + pageSize', () => {
            const res = pagination({pageSize: 30, pageIndex: 2});
            expect(res['skip']).toBe(60);
            expect(res['limit']).toBe(30);
        })
    })
})