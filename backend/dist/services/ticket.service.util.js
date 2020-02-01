"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_model_1 = require("../models/ticket.model");
const mongoose_1 = require("mongoose");
function filter(query) {
    const { openSelected, progressSelected, closedSelected } = query;
    const statusArr = [];
    // handle status
    if (openSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(ticket_model_1.TicketStatus.OPEN);
    }
    if (progressSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(ticket_model_1.TicketStatus.ACTIVE);
    }
    if (closedSelected === 'true' || typeof openSelected === 'undefined') {
        statusArr.push(ticket_model_1.TicketStatus.CLOSED);
    }
    const match = {
        status: { $in: statusArr },
    };
    if (query.editedDateStart || query.editedDateEnd) {
        const obj = {};
        if (query.editedDateStart) {
            obj['$gte'] = new Date(query.editedDateStart);
        }
        if (query.editedDateEnd) {
            obj['$lte'] = new Date(query.editedDateEnd);
        }
        match['updatedAt'] = obj;
    }
    // text search
    const regexTextSearch = new RegExp(`.*${query.filter || ""}.*`, "i");
    match['$or'] = [
        { affectedSystems: { $in: [regexTextSearch] } },
        { title: regexTextSearch },
    ];
    // remaining filters
    const filters = ['priority', 'category'];
    for (let filter of filters) {
        if (query[filter]) {
            match[filter] = query[filter];
        }
    }
    if (query['userId']) {
        // strings needs to be converted to object-id for aggregation
        // TODO do this with express-validator
        match['owner'] = mongoose_1.Types.ObjectId(query['userId']);
    }
    return match;
}
exports.filter = filter;
/**
 * Is necessary for mongodb aggregate function since tickets are subdocuments
 * @param obj object to be mapped
 * @param fieldname is added in front of original object keys
 */
// Note: original object does not get mutated
function remapObject(obj, fieldname) {
    const mappedObj = {};
    for (let key of Object.keys(obj)) {
        // handle operators $or, $and
        if (key === '$or' || key === '$and') {
            mappedObj[key] = obj[key].map((subObj) => remapObject(subObj, fieldname));
        }
        else {
            mappedObj[fieldname + '.' + key] = obj[key];
        }
    }
    return mappedObj;
}
exports.remapObject = remapObject;
function isEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}
exports.isEmpty = isEmpty;
function prepareAggregateStages(match, sort, pagination) {
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
    ticket_model_1.ticketSchema.eachPath((path) => {
        projection[path] = `$tickets.${path}`;
    });
    aggregates.push({ $project: projection });
    return aggregates;
}
exports.prepareAggregateStages = prepareAggregateStages;
/**
 * Add _id of project to match-object.
 * This is needed so that aggregate only applies to specific project (it would always return tickets of all projects otherwise).
 */
function withProjectId(match, projectId) {
    return {
        _id: projectId,
        ...match
    };
}
exports.withProjectId = withProjectId;
//# sourceMappingURL=ticket.service.util.js.map