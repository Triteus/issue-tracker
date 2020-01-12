
export interface PaginationParams {
    pageIndex?: string | number;
    pageSize?: string | number;
}


export interface PreparedPaginationParams {
    skip?: number;
    limit?: number;
}

export class PaginationService {

    static preparePagination(query: PaginationParams): PreparedPaginationParams {
        const pageIndex = Number.parseInt(query.pageIndex as string);
        const pageSize = Number.parseInt(query.pageSize as string);
        let options = {};
        if (Number.isInteger(pageIndex) && Number.isInteger(pageSize)
            && pageIndex >= 0 && pageSize >= 0) {
            options = {
                skip: pageIndex * pageSize,
                limit: pageSize
            }
        }
        return options;
    }

}