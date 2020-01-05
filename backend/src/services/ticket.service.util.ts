import { TicketStatus, ticketSchema, Priority } from "../models/Ticket";
import { Types } from "mongoose";


type boolStr = 'true' | 'false';

export interface FilterParams {
    filter?: string;
    openSelected?: boolStr;
    closedSelected?: boolStr;
    progressSelected?: boolStr;
    priority?: Priority | null;
    systems?: string[] | string;
    editedDateStart?: string | null;
    editedDateEnd?: string | null;
    category?: string;
    userId?: string;
}

export interface PaginationParams {
    pageIndex?: string | number;
    pageSize?: string | number;
}

export interface SortParams {
    sortDir?: string;
    sortBy?: string;
}

export type TicketParams = FilterParams & PaginationParams & SortParams;


export function pagination(query: PaginationParams) {
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

export interface PreparedSortParams {
    [key: string]: 1 | -1
}

export function sort(query: SortParams) {
    const { sortBy, sortDir } = query;
    const sort = {}

    if (sortBy && sortDir && ['asc', 'desc'].includes(sortDir)) {
        sort[sortBy] = ((sortDir === 'asc') ? 1 : -1);
    }
    return sort;
}

export function filter(query: FilterParams) {
    const { openSelected, progressSelected, closedSelected } = query;
    const statusArr: TicketStatus[] = [];

    // handle status
    if (openSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(TicketStatus.OPEN);
    }
    if (progressSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(TicketStatus.ACTIVE);
    }
    if (closedSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(TicketStatus.CLOSED)
    }
    const match = {
        status: { $in: statusArr },
    };

    if(query.editedDateStart || query.editedDateEnd) {
        const obj = {};
        if(query.editedDateStart) {
            obj['$gte'] = query.editedDateStart;
        }
        if(query.editedDateEnd) {
            obj['$lte'] = query.editedDateEnd;            
        }
        match['updatedAt'] = obj;
    }

    if (query.filter) {
        match['title'] = { $regex: `.*${query.filter}.*`, $options: 'i' };
    }

    if (query.systems) {
        // make sure value is an array for query
        let systems = query.systems;
        if (Array.isArray(systems)) {
            systems = systems.map((s: string) => s.toLowerCase());
        } else {
            systems = [systems.toLowerCase()];
        }
        match['affectedSystems'] = { $in: systems }
    }

    // remaining filters
    const filters = ['priority', 'category', 'userId'];
    for (let filter of filters) {
        if (query[filter]) {
            match[filter] = query[filter];
        }
    }
    return match;
}

/**
 * Is necessary for mongodb aggregate function since tickets are subdocuments
 * @param obj object to be mapped
 * @param fieldname is added in front of original object keys 
 */
// Note: original object does not get mutated
export function remapObject(obj: object, fieldname: string) {
    const mappedObj = {};
    for (let key of Object.keys(obj)) {
        mappedObj[fieldname + '.' + key] = obj[key];
    }
    return mappedObj;
}

export function isEmpty(obj: object) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

export function prepareAggregateStages(match: object, sort: PreparedSortParams, pagination: PaginationParams) {
    // IMPORTANT: Order of adding objects is essential for correct aggregate
    // 1 $sort; 2 $match; 3 $limit; 4 $skip; 5 $unwind; 6 $match; 7 $sort 8 $project
    const aggregates = [];

    if (!isEmpty(sort)) {
        // 1 $sort
        aggregates.push({ $sort: sort });
    }
    // 2 $match
    aggregates.push({ $match: match })

    const { pageIndex, pageSize } = pagination;
    if (pageSize) {
        const limit = Number.parseInt(pageSize + '');
        // 3 $limit
        aggregates.push({ $limit: limit });
    }
    if (pageSize && pageIndex) {
        const skip = Number.parseInt(pageIndex + '') * Number.parseInt(pageSize + '');
        // 4 $skip
        aggregates.push({ $skip: skip });
    }
    // 5 $unwind and 6 $match
    aggregates.push({ $unwind: '$tickets' }, { $match: match });

    if (!isEmpty(sort)) {
        // 7 $sort (items need to be sorted again)
        aggregates.push({ $sort: sort });
    }
    const projection = {};
    ticketSchema.eachPath((path) => {
        projection[path] = `$tickets.${path}`;
    })
    // 8 $project
    aggregates.push({$project: projection});

    return aggregates;

}


/**
 * Add _id of project to match-object.
 * This is needed so that aggregate only applies to specific project (it would always return tickets of all projects otherwise).
 */

export function withProjectId(match: object, projectId: string | Types.ObjectId) {
    return {
        _id: projectId,
        ...match
    }
}