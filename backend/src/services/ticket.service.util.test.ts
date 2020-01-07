import { sort, filter, pagination, prepareAggregateStages, PreparedSortParams, PaginationParams, PreparedPaginationParams } from "./ticket.service.util";
import { Priority, TicketStatus, TicketCategory } from "../models/Ticket";
import { Types } from "mongoose";

describe('ticket-service-utils', () => {

    describe('sorting', () => {
        it('returns empty object if sortBy is undefined', () => {
            const res = sort({ sortDir: 'asc' });
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();
        })
        it('returns empty object if sortBy or sortDir is undefined', () => {
            const res = sort({ sortBy: 'status' });
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();
        })
        it('returns empty object if sortDir is invalid', () => {
            const res = sort({ sortBy: 'status', sortDir: 'sdfsdfsd' });
            expect(res['sortDir']).toBeFalsy();
            expect(res['sortBy']).toBeFalsy();
        })

        it('returns object [sortBy]: -1', () => {
            const res = sort({ sortBy: 'status', sortDir: 'desc' });
            expect(res['status']).toBeTruthy();
            expect(res['status']).toBe(-1);

        })
        it('returns object [sortBy]: 1', () => {
            const res = sort({ sortBy: 'status', sortDir: 'asc' });
            expect(res['status']).toBeTruthy();
            expect(res['status']).toBe(1);
        })
    })
    describe('filtering', () => {
        it('returns object with status (selectors undefined)', () => {
            const res = filter({});
            expect(res['status']).toEqual({ $in: ['open', 'active', 'closed'] });
        })

        it('returns object with updatedAt: {$gte: xxx}', () => {
            const date = new Date();
            const res = filter({ editedDateStart: date.toJSON() });
            expect(res['updatedAt']).toBeTruthy();
            expect(res['updatedAt'].$gte).toBe(date.toJSON());
        })

        it('returns object with updatedAt: {$lte: xxx}', () => {
            const date = new Date();
            const res = filter({ editedDateEnd: date.toJSON() });
            expect(res['updatedAt']).toBeTruthy();
            expect(res['updatedAt'].$lte).toBe(date.toJSON());
        })

        it('returns systems array (all values lowercase)', () => {
            const res = filter({ systems: ['JIRA', 'CONFLUENCE', 'OUTLOOK'] });
            expect(res['affectedSystems']).toEqual({ $in: ['jira', 'confluence', 'outlook'] });
        })

        it('returns object with remaining filters', () => {
            const remainingFilters = {
                priority: Priority.HIGH,
                category: TicketCategory.BUG
            }
            const res = filter(remainingFilters);
            for (let key of Object.keys(remainingFilters)) {
                expect(res[key]).toBeTruthy();
                expect(res[key]).toBe(remainingFilters[key]);
            }
        })

        it('returns object with id of user (ticket-owner)', () => {
            const id = new Types.ObjectId();
            const res = filter({ userId: id.toHexString() });
            expect(res['owner']).toBeTruthy();
            // id (string) is converted to object-id
            expect(res['owner']).toEqual(id);
        })
    })

    describe('pagination', () => {
        it('returns empty object (pageIndex undefined)', () => {
            const res = pagination({ pageSize: 20 });
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        it('returns empty object (pageIndex < 0)', () => {
            const res = pagination({ pageIndex: -1, pageSize: 20 });
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })

        it('return empty object (pageSize undefined)', () => {
            const res = pagination({ pageIndex: 20 });
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })
        it('return empty object (pageSize < 0)', () => {
            const res = pagination({ pageSize: -1, pageIndex: 2 });
            expect(res['skip']).toBeFalsy();
            expect(res['limit']).toBeFalsy();
        })

        it('returns pageIndex + pageSize', () => {
            const res = pagination({ pageSize: 30, pageIndex: 2 });
            expect(res['skip']).toBe(60);
            expect(res['limit']).toBe(30);
        })
        it('returns pageIndex + pageSize', () => {
            const res = pagination({ pageSize: 30, pageIndex: 0 });
            expect(res['skip']).toBe(0);
            expect(res['limit']).toBe(30);
        })
        it('returns pageIndex + pageSize', () => {
            const res = pagination({ pageSize: 0, pageIndex: 2 });
            expect(res['skip']).toBe(0);
            expect(res['limit']).toBe(0);
        })
    })

    describe('prepareAggregationStages', () => {

        const sort: PreparedSortParams = { status: 1 };
        const pagination: PreparedPaginationParams = { skip: 2, limit: 10 };
        const match: object = {};

        it('has match as first stage', () => {
            const stages = prepareAggregateStages({}, {}, {})
            expect(stages[0].$match).toBeTruthy();
        })

        it('has unwind as second stage', () => {
            const stages = prepareAggregateStages({}, {}, {})
            expect(stages[1].$unwind).toBeTruthy();
        })

        it('has match as third stage', () => {
            const stages = prepareAggregateStages({}, {}, {})
            expect(stages[2].$match).toBeTruthy();
        })

        it('has sort as fourth stage', () => {
            const stages = prepareAggregateStages(match, sort, pagination)
            expect(stages[3].$sort).toBeTruthy();
        })
        it('has no sort as fourth stage', () => {
            const stages = prepareAggregateStages(match, {}, pagination)
            expect(stages[3].$sort).toBeFalsy();
        })
        it('has skip as fifth stage', () => {
            const stages = prepareAggregateStages(match, sort, pagination)
            expect(stages[4].$skip).toBeTruthy();
        })
        it('has no skip as fifth stage', () => {
            const stages = prepareAggregateStages(match, sort, { limit: 20 })
            expect(stages[4].$skip).toBeFalsy();
        })
        it('has limit as sixth stage', () => {
            const stages = prepareAggregateStages(match, sort, pagination)
            expect(stages[5].$limit).toBeTruthy();
        })
        it('has no limit as sixth stage (no limit)', () => {
            const stages = prepareAggregateStages(match, sort, {skip: 0})
            expect(stages[5].$limit).toBeFalsy();
        })

        it('has project as fifth stage (no pagination)', () => {
            const stages = prepareAggregateStages(match, sort, {})
            expect(stages[4].$project).toBeTruthy();
        })

        it('has project as seventh stage', () => {
            const stages = prepareAggregateStages(match, sort, pagination)
            expect(stages[6].$project).toBeTruthy();
        })
    })
})