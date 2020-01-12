import { SortService } from "./sort.service";

describe('SortService sort', () => {
    it('returns empty object if sortBy is undefined', () => {
        const res = SortService.prepareSort({ sortDir: 'asc' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    })
    it('returns empty object if sortBy or sortDir is undefined', () => {
        const res = SortService.prepareSort({ sortBy: 'status' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    })
    it('returns empty object if sortDir is invalid', () => {
        const res = SortService.prepareSort({ sortBy: 'status', sortDir: 'sdfsdfsd' });
        expect(res['sortDir']).toBeFalsy();
        expect(res['sortBy']).toBeFalsy();
    })

    it('returns object [sortBy]: -1', () => {
        const res = SortService.prepareSort({ sortBy: 'status', sortDir: 'desc' });
        expect(res['status']).toBeTruthy();
        expect(res['status']).toBe(-1);

    })
    it('returns object [sortBy]: 1', () => {
        const res = SortService.prepareSort({ sortBy: 'status', sortDir: 'asc' });
        expect(res['status']).toBeTruthy();
        expect(res['status']).toBe(1);
    })
})