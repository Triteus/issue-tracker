"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_util_1 = require("./ticket.service.util");
const Ticket_1 = require("../models/Ticket");
const mongoose_1 = require("mongoose");
describe('ticket-service-utils', () => {
    describe('filtering', () => {
        it('returns object with status (selectors undefined)', () => {
            const res = ticket_service_util_1.filter({});
            expect(res['status']).toEqual({ $in: ['open', 'active', 'closed'] });
        });
        it('returns object with updatedAt: {$gte: xxx}', () => {
            const date = new Date();
            const res = ticket_service_util_1.filter({ editedDateStart: date.toJSON() });
            expect(res['updatedAt']).toBeTruthy();
            expect(res['updatedAt'].$gte).toEqual(date);
        });
        it('returns object with updatedAt: {$lte: xxx}', () => {
            const date = new Date();
            const res = ticket_service_util_1.filter({ editedDateEnd: date.toJSON() });
            expect(res['updatedAt']).toBeTruthy();
            expect(res['updatedAt'].$lte).toEqual(date);
        });
        it('returns $or (textsearch) including affectedSystems and title', async () => {
            const res = ticket_service_util_1.filter({});
            expect(res['$or']).toBeTruthy();
            for (let obj of res['$or']) {
                expect(['title', 'affectedSystems']).toContain(Object.keys(obj)[0]);
            }
        });
        it('returns object with remaining filters', () => {
            const remainingFilters = {
                priority: Ticket_1.Priority.HIGH,
                category: Ticket_1.TicketCategory.BUG
            };
            const res = ticket_service_util_1.filter(remainingFilters);
            for (let key of Object.keys(remainingFilters)) {
                expect(res[key]).toBeTruthy();
                expect(res[key]).toBe(remainingFilters[key]);
            }
        });
        it('returns object with id of user (ticket-owner)', () => {
            const id = new mongoose_1.Types.ObjectId();
            const res = ticket_service_util_1.filter({ userId: id.toHexString() });
            expect(res['owner']).toBeTruthy();
            // id (string) is converted to object-id
            expect(res['owner']).toEqual(id);
        });
    });
    describe('prepareAggregationStages', () => {
        const sort = { status: 1 };
        const pagination = { skip: 2, limit: 10 };
        const match = {};
        it('has match as first stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages({}, {}, {});
            expect(stages[0].$match).toBeTruthy();
        });
        it('has unwind as second stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages({}, {}, {});
            expect(stages[1].$unwind).toBeTruthy();
        });
        it('has match as third stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages({}, {}, {});
            expect(stages[2].$match).toBeTruthy();
        });
        it('has sort as fourth stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
            expect(stages[3].$sort).toBeTruthy();
        });
        it('has no sort as fourth stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, {}, pagination);
            expect(stages[3].$sort).toBeFalsy();
        });
        it('has skip as fifth stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
            expect(stages[4].$skip).toBeTruthy();
        });
        it('has no skip as fifth stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, { limit: 20 });
            expect(stages[4].$skip).toBeFalsy();
        });
        it('has limit as sixth stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
            expect(stages[5].$limit).toBeTruthy();
        });
        it('has no limit as sixth stage (no limit)', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, { skip: 0 });
            expect(stages[5].$limit).toBeFalsy();
        });
        it('has project as fifth stage (no pagination)', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, {});
            expect(stages[4].$project).toBeTruthy();
        });
        it('has project as seventh stage', () => {
            const stages = ticket_service_util_1.prepareAggregateStages(match, sort, pagination);
            expect(stages[6].$project).toBeTruthy();
        });
    });
});
//# sourceMappingURL=ticket.service.util.test.js.map