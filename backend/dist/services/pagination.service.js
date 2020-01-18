"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PaginationService {
    static preparePagination(query) {
        const pageIndex = Number.parseInt(query.pageIndex);
        const pageSize = Number.parseInt(query.pageSize);
        let options = {};
        if (Number.isInteger(pageIndex) && Number.isInteger(pageSize)
            && pageIndex >= 0 && pageSize >= 0) {
            options = {
                skip: pageIndex * pageSize,
                limit: pageSize
            };
        }
        return options;
    }
}
exports.PaginationService = PaginationService;
//# sourceMappingURL=pagination.service.js.map