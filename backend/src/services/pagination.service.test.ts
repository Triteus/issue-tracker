import { PaginationService } from "./pagination.service";

describe('PaginationService (pagination)', () => {
    it('returns empty object (pageIndex undefined)', () => {
        const res = PaginationService.preparePagination({ pageSize: 20 });
        expect(res['skip']).toBeFalsy();
        expect(res['limit']).toBeFalsy();
    })
    it('returns empty object (pageIndex < 0)', () => {
        const res = PaginationService.preparePagination({ pageIndex: -1, pageSize: 20 });
        expect(res['skip']).toBeFalsy();
        expect(res['limit']).toBeFalsy();
    })

    it('return empty object (pageSize undefined)', () => {
        const res = PaginationService.preparePagination({ pageIndex: 20 });
        expect(res['skip']).toBeFalsy();
        expect(res['limit']).toBeFalsy();
    })
    it('return empty object (pageSize < 0)', () => {
        const res = PaginationService.preparePagination({ pageSize: -1, pageIndex: 2 });
        expect(res['skip']).toBeFalsy();
        expect(res['limit']).toBeFalsy();
    })

    it('returns pageIndex + pageSize', () => {
        const res = PaginationService.preparePagination({ pageSize: 30, pageIndex: 2 });
        expect(res['skip']).toBe(60);
        expect(res['limit']).toBe(30);
    })
    it('returns pageIndex + pageSize', () => {
        const res = PaginationService.preparePagination({ pageSize: 30, pageIndex: 0 });
        expect(res['skip']).toBe(0);
        expect(res['limit']).toBe(30);
    })
    it('returns pageIndex + pageSize', () => {
        const res = PaginationService.preparePagination({ pageSize: 0, pageIndex: 2 });
        expect(res['skip']).toBe(0);
        expect(res['limit']).toBe(0);
    })
})