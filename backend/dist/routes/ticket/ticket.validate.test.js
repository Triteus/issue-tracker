"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_validate_1 = require("./ticket.validate");
const test_util_1 = require("../../validators/test-util");
const Ticket_1 = require("../../models/Ticket");
const bson_1 = require("bson");
const ticket_1 = require("../../test-data/ticket");
describe('Ticket validators', () => {
    describe('basic validators', () => {
        const validators = ticket_validate_1.basicValidators;
        it('throws (invalid title)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), title: 't' }, validators);
            test_util_1.checkResponse(errors, 'title', 'Invalid value');
        });
        it('throws (invalid category', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), category: 'invalidCat' }, validators);
            test_util_1.checkResponse(errors, 'category', 'Invalid value');
        });
        it('throws (invalid priority)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), priority: 100000 }, validators);
            test_util_1.checkResponse(errors, 'priority', 'Invalid value');
        });
        it('throws (invalid systems)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), affectedSystems: 'noArr' }, validators);
            test_util_1.checkResponse(errors, 'affectedSystems', 'Invalid value');
        });
        it('throws (invalid neededAt)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), neededAt: 'invalidDate' }, validators);
            test_util_1.checkResponse(errors, 'neededAt', 'Invalid value');
        });
        it('throws (tried to change owner)', async () => {
            const id = new bson_1.ObjectID();
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), owner: id }, validators);
            test_util_1.checkResponse(errors, 'owner', 'Invalid value');
        });
        it('throws (tried to change lastEditor)', async () => {
            const id = new bson_1.ObjectID();
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), lastEditor: id }, validators);
            test_util_1.checkResponse(errors, 'lastEditor', 'Invalid value');
        });
        it('throws (tried to change editor)', async () => {
            const id = new bson_1.ObjectID();
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), editors: id }, validators);
            test_util_1.checkResponse(errors, 'editors', 'Invalid value');
        });
        it('throws (filenames is not array)', async () => {
            const id = new bson_1.ObjectID();
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), filenames: 'invalid' }, validators);
            test_util_1.checkResponse(errors, 'filenames', 'Invalid value');
        });
    });
    describe('POST /api/ticket', () => {
        const validators = ticket_validate_1.TicketValidators.createTicket;
        it('throws (invalid status/only status "open" allowed)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData(), status: 'invalidStatus' }, validators);
            test_util_1.checkResponse(errors, 'status', 'Invalid value');
        });
        it('passes (necessary body props)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData() }, validators);
            expect(errors.length).toBe(0);
        });
        it('passes (all body props)', async () => {
            const errors = await test_util_1.validateBody({ ...ticket_1.ticketData() }, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('PUT /api/ticket/:id', () => {
        const validTicketData = {
            ...ticket_1.ticketData(),
            status: Ticket_1.TicketStatus.ACTIVE
        };
        const validators = ticket_validate_1.TicketValidators.putTicket;
        it('throws (invalid status)', async () => {
            const errors = await test_util_1.validateBody({ ...validTicketData, status: 'invalidStatus' }, validators);
            test_util_1.checkResponse(errors, 'status', 'Invalid value');
        });
        it('passes (valid body props)', async () => {
            const errors = await test_util_1.validateBody(validTicketData, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('PATCH /api/ticket/:id/sub-task', () => {
        const validators = ticket_validate_1.TicketValidators.changeSubTasks;
        it('throws (not an array)', async () => {
            const errors = await test_util_1.validateBody({ subTasks: 'no array' }, validators);
            test_util_1.checkResponse(errors, 'subTasks', 'Invalid value');
        });
        it('throws (invalid description)', async () => {
            const errors = await test_util_1.validateBody({ subTasks: [{ isDone: true }, { isDone: false }] }, validators);
            test_util_1.checkResponses(errors, 'subTasks', 'Invalid value');
        });
        it('throws (description not a string)', async () => {
            const errors = await test_util_1.validateBody({ subTasks: [{ description: false, isDone: true }, { description: true, isDone: false }] }, validators);
            test_util_1.checkResponses(errors, 'subTasks', 'Invalid value');
        });
        it('throws (invalid isDone)', async () => {
            const errors = await test_util_1.validateBody({ subTasks: [{ description: 'desc' }, { description: 'desc' }] }, validators);
            test_util_1.checkResponses(errors, 'subTasks', 'Invalid value');
        });
        it('throws (isDone is not boolean)', async () => {
            const errors = await test_util_1.validateBody({ subTasks: [{ description: 'desc', isDone: 'noBool' }, { description: 'desc', isDone: 'noBool' }] }, validators);
            test_util_1.checkResponses(errors, 'subTasks', 'Invalid value');
        });
    });
    describe('PATCH /api/ticket/:id/title', () => {
        const validators = ticket_validate_1.TicketValidators.changeTitle;
        it('throws (title length < 5)', async () => {
            const errors = await test_util_1.validateBody({ title: 'lul' }, validators);
            test_util_1.checkResponse(errors, 'title', 'Invalid value');
        });
        it('passes', async () => {
            const errors = await test_util_1.validateBody({ title: 'valid-title' }, validators);
            expect(errors.length).toBe(0);
        });
    });
    describe('DELETE /api/ticket/:id', () => {
    });
    describe('GET /api/ticket/:id', () => {
    });
    describe('GET /api/ticket', () => {
    });
});
//# sourceMappingURL=ticket.validate.test.js.map