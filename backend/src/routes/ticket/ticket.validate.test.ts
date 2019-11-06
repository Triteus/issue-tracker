import { TicketValidators, basicValidators } from "./ticket.validate";
import { validateBody, checkResponse, validateBodyAndParams, checkResponses } from "../../validators/test-util";
import { ticketSchema, TicketStatus, Priority } from "../../models/Ticket";
import { ObjectID } from "bson";

describe('Ticket validators', () => {

    const ticketMock = {
        title: 'Something does not work',
        description: 'A sample ticket',
        priority: Priority.HIGH,
        neededAt: new Date().toJSON()
    }


    describe('basic validators', () => {

        const validators = basicValidators;

        it('throws (invalid title)', async () => {
            const errors = await validateBody({ ...ticketMock, title: 't' }, validators);
            checkResponse(errors, 'title', 'Invalid value');
        })
        it('throws (invalid priority)', async () => {
            const errors = await validateBody({ ...ticketMock, priority: 100000 }, validators);
            checkResponse(errors, 'priority', 'Invalid value');
        })
        it('throws (invalid systems)', async () => {
            const errors = await validateBody({ ...ticketMock, affectedSystems: 'noArr' }, validators);
            checkResponse(errors, 'affectedSystems', 'Invalid value');
        })

        it('throws (invalid neededAt)', async () => {
            const errors = await validateBody({ ...ticketMock, neededAt: 'invalidDate' }, validators);
            checkResponse(errors, 'neededAt', 'Invalid value');
        })

        it('throws (tried to change ownerID)', async () => {
            const id = new ObjectID();
            const errors = await validateBody({ ...ticketMock, ownerId: id }, validators);
            checkResponse(errors, 'ownerId', 'Invalid value');
        })

        it('throws (tried to change lastEditorID)', async () => {
            const id = new ObjectID();
            const errors = await validateBody({ ...ticketMock, lastEditorId: id }, validators);
            checkResponse(errors, 'lastEditorId', 'Invalid value');
        })

        it('throws (tried to change editorIds)', async () => {
            const id = new ObjectID();
            const errors = await validateBody({ ...ticketMock, editorIds: id }, validators);
            checkResponse(errors, 'editorIds', 'Invalid value');
        })
    })

    describe('POST /api/ticket', () => {

        const validators = TicketValidators.createTicket;


        it('throws (invalid status/only status "open" allowed)', async () => {
            const errors = await validateBody({ ...ticketMock, status: 'invalidStatus' }, validators);
            checkResponse(errors, 'status', 'Invalid value');
        })

        it('passes (necessary body props)', async () => {
            const errors = await validateBody({ ...ticketMock }, validators);
            expect(errors.length).toBe(0);
        })

        it('passes (all body props)', async () => {
            const errors = await validateBody({ ...ticketMock }, validators);
            expect(errors.length).toBe(0);
        })

    })

    describe('PUT /api/ticket/:id', () => {

        const validTicketMock = {
            ...ticketMock,
            status: TicketStatus.ACTIVE
        }

        const validators = TicketValidators.putTicket;

        it('throws (invalid status)', async () => {
            const errors = await validateBody({ ...validTicketMock, status: 'invalidStatus' }, validators);
            checkResponse(errors, 'status', 'Invalid value');
        })

        it('passes (all body props)', async () => {

        })
    })

    describe('PATCH /api/ticket/:id/sub-task', () => {

        const validators = TicketValidators.changeSubTasks;

        it('throws (not an array)', async () => {
            const errors = await validateBody({ subTasks: 'no array' }, validators);
            checkResponse(errors, 'subTasks', 'Invalid value');
        })
        it('throws (invalid description)', async () => {
            const errors = await validateBody({ subTasks: [{isDone: true}, {isDone: false}] }, validators);
            checkResponses(errors, 'subTasks', 'Invalid value');
        })

        it('throws (description not a string)', async () => {
            const errors = await validateBody({ subTasks: [{description: false, isDone: true}, {description: true, isDone: false}] }, validators);
            checkResponses(errors, 'subTasks', 'Invalid value');
        })

        it('throws (invalid isDone)', async () => {
            const errors = await validateBody({ subTasks: [{description: 'desc'}, {description: 'desc'}] }, validators);
            checkResponses(errors, 'subTasks', 'Invalid value');
        })

        it('throws (isDone is not boolean', async () => {
            const errors = await validateBody({ subTasks: [{description: 'desc', isDone: 'noBool'}, {description: 'desc', isDone: 'noBool'}] }, validators);
            checkResponses(errors, 'subTasks', 'Invalid value');
        })
    })

    describe('DELETE /api/ticket/:id', () => {

    })

    describe('GET /api/ticket/:id', () => {

    })

    describe('GET /api/ticket', () => {

    })

})