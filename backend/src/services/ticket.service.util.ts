import { TicketStatus, ticketSchema, Priority } from "../models/Ticket";
import { Types } from "mongoose";
import { PaginationParams, PreparedPaginationParams } from "./pagination.service";
import { SortParams, PreparedSortParams } from "./sort.service";


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


export type TicketParams = FilterParams & PaginationParams & SortParams;


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
    const filters = ['priority', 'category'];
    for (let filter of filters) {
        if (query[filter]) {
            match[filter] = query[filter];
        }
    }

    if(query['userId']) {
        // strings needs to be converted to object-id for aggregation
        // TODO do this with express-validator
        match['owner'] = Types.ObjectId(query['userId']);
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

export function prepareAggregateStages(match: object, sort: PreparedSortParams, pagination: PreparedPaginationParams) {
    // IMPORTANT: Order of adding objects is essential for correct aggregate
    const aggregates = [];

    aggregates.push({ $match: match }, { $unwind: '$tickets' }, { $match: match });

    if (!isEmpty(sort)) {
        aggregates.push({ $sort: sort });
    }

    const { skip, limit } = pagination;
    if (!isNaN(skip)) {
        aggregates.push({ $skip: skip });
    }

    if (!isNaN(limit)) {
        aggregates.push({ $limit: limit });
    }

    const projection = {};
    ticketSchema.eachPath((path) => {
        projection[path] = `$tickets.${path}`;
    })
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