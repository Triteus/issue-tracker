import TicketModel, { TicketStatus } from './Ticket';
import { ticketData, subTasksData } from '../test-data/ticket';
import { Types } from 'mongoose';
describe('Ticket model', () => {


    describe('set subTasks', () => {
        it('sets subTasks (method)', async () => {
            // we assume that user with id exists 
            const editorId = new Types.ObjectId();
            const ticket = new TicketModel(ticketData());
            const subTasks = subTasksData();
            ticket.setSubTasks(subTasks, editorId);
            subTasks.forEach((task, index) => {
                expect(ticket.subTasks[index]).toMatchObject(task);
            })
        })
    })


    it('sets editor (method)', async () => {
        const id = new Types.ObjectId();
        const ticket = new TicketModel(ticketData());
        ticket.setEditor(id);
        expect(ticket.lastEditorId).toEqual(id);
        expect(ticket.editorIds).toContainEqual(id);
    })

    it('sets editor and saves (method)', async () => {
        jest.spyOn(TicketModel.prototype, 'save')
        .mockImplementationOnce(() => Promise.resolve());
        const id = new Types.ObjectId();
        const ticket = new TicketModel(ticketData());
        await expect(ticket.setEditorAndSave(id)).resolves.not.toThrow();
    })

    describe('change status method', () => {
        it('clears path assigend when status switches to open', async () => {
            const ticket = new TicketModel(ticketData());
            // status must be in active status to have assigned user
            ticket.status = TicketStatus.ACTIVE;
            ticket.assignedTo = new Types.ObjectId();

            const editorId = new Types.ObjectId();
            ticket.changeStatus(TicketStatus.OPEN, editorId);
            expect(ticket.status).toBe(TicketStatus.OPEN);
            expect(ticket.assignedTo).toBeFalsy();
        })
        it('clears path assigendTo when status switches to closed', async () => {
            const ticket = new TicketModel(ticketData());
            // status must be in active status to have assigned user
            ticket.status = TicketStatus.ACTIVE;
            ticket.assignedTo = new Types.ObjectId();

            const editorId = new Types.ObjectId();
            ticket.changeStatus(TicketStatus.CLOSED, editorId);
            expect(ticket.status).toBe(TicketStatus.CLOSED);
            expect(ticket.assignedTo).toBeFalsy();
        })

        it('changes path assignedTo to given editorId', async () => {
            const ticket = new TicketModel(ticketData());
            ticket.assignedTo = null;
            const editorId = new Types.ObjectId();
            ticket.changeStatus(TicketStatus.ACTIVE, editorId);
            expect(ticket.status).toBe(TicketStatus.ACTIVE);
            expect(ticket.assignedTo).toEqual(editorId);
        })
    })

    it('to JSON', async () => {
        const ticket = new TicketModel(ticketData());
        const ticketJSON = ticket.toJSON();
        expect(ticketJSON._id).toBeFalsy();
        expect(ticketJSON.__v).toBeFalsy();

    })
})