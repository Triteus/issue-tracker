export interface SortParams {
    sortDir?: string;
    sortBy?: string;
}

export interface PreparedSortParams {
    [key: string]: 1 | -1
}

export class SortService {

    static prepareSort(query: SortParams): PreparedSortParams {
        const { sortBy, sortDir } = query;
        const sort = {}

        if (sortBy && sortDir && ['asc', 'desc'].includes(sortDir)) {
            sort[sortBy] = ((sortDir === 'asc') ? 1 : -1);
        }
        return sort;
    }

}