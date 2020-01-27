import { Types } from "mongoose";
import { CommentModel, commentSchema, ICommentDocument } from "../models/comment.model";
import { ProjectModel } from "../models/project.model";
import { PaginationService } from "./pagination.service";
import { SortService } from "./sort.service";
import { isEmpty } from "./ticket.service.util";

type ID = String | Types.ObjectId;
export class CommentService {

    async getCommentsUpdatedAsc(projectId: Types.ObjectId, ticketId: Types.ObjectId, query: object): Promise<ICommentDocument[]> {
        const {limit, skip} = PaginationService.preparePagination(query);
        const sort = SortService.prepareSort(query);

        const projection = {};
        commentSchema.eachPath((path) => {
            projection[path] = `$comments.${path}`;
        })

        const stages = [];
        if(!isEmpty(sort)) {
            stages.push({$sort: sort});
        }
        if(!isNaN(skip)) {
            stages.push({$skip: skip});
        }
        if(!isNaN(limit)) {
            stages.push({$limit: limit});
        }

        return ProjectModel.aggregate([
            {$match: {_id: projectId, 'tickets._id': ticketId}},
            {$unwind: '$tickets'},
            {$match: {'tickets._id': ticketId}},
            {$project: {comments: '$tickets.comments'}},
            {$unwind: '$comments'},
            {$project: projection},
            ...stages
        ])
    }
}