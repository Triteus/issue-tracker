"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SortService {
    static prepareSort(query) {
        const { sortBy, sortDir } = query;
        const sort = {};
        if (sortBy && sortDir && ['asc', 'desc'].includes(sortDir)) {
            sort[sortBy] = ((sortDir === 'asc') ? 1 : -1);
        }
        return sort;
    }
}
exports.SortService = SortService;
//# sourceMappingURL=sort.service.js.map