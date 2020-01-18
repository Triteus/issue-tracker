"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sort_service_1 = require("./sort.service");
describe('SortService sort', () => {
    it('returns empty object if sortBy is undefined', () => {
        const res = sort_service_1.SortService.prepareSort({ sortDir: 'asc' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    });
    it('returns empty object if sortBy or sortDir is undefined', () => {
        const res = sort_service_1.SortService.prepareSort({ sortBy: 'status' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    });
    it('returns empty object if sortDir is invalid', () => {
        const res = sort_service_1.SortService.prepareSort({ sortBy: 'status', sortDir: 'sdfsdfsd' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    });
    it('returns object [sortBy]: -1', () => {
        const res = sort_service_1.SortService.prepareSort({ sortBy: 'status', sortDir: 'desc' });
        expect(res['status']).toBeTruthy();
        expect(res['status']).toBe(-1);
    });
    it('returns object [sortBy]: 1', () => {
        const res = sort_service_1.SortService.prepareSort({ sortBy: 'status', sortDir: 'asc' });
        expect(res['status']).toBeTruthy();
        expect(res['status']).toBe(1);
    });
});
//# sourceMappingURL=sort.service.test.js.map