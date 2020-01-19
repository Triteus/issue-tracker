"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Comment_1 = require("../models/Comment");
const Project_1 = require("../models/Project");
const pagination_service_1 = require("./pagination.service");
const sort_service_1 = require("./sort.service");
const ticket_service_util_1 = require("./ticket.service.util");
class CommentService {
    async getCommentsUpdatedAsc(projectId, ticketId, query) {
        const { limit, skip } = pagination_service_1.PaginationService.preparePagination(query);
        const sort = sort_service_1.SortService.prepareSort(query);
        const projection = {};
        Comment_1.commentSchema.eachPath((path) => {
            projection[path] = `$comments.${path}`;
        });
        const stages = [];
        if (!ticket_service_util_1.isEmpty(sort)) {
            stages.push({ $sort: sort });
        }
        if (!isNaN(skip)) {
            stages.push({ $skip: skip });
        }
        if (!isNaN(limit)) {
            stages.push({ $limit: limit });
        }
        return Project_1.ProjectModel.aggregate([
            { $match: { _id: projectId, 'tickets._id': ticketId } },
            { $unwind: '$tickets' },
            { $match: { 'tickets._id': ticketId } },
            { $project: { comments: '$tickets.comments' } },
            { $unwind: '$comments' },
            { $project: projection },
            ...stages
        ]);
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map