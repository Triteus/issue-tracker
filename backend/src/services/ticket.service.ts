import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus, Priority, ticketSchema } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";
import mongoose from 'mongoose';
import { IProject, ProjectModel } from "../models/Project";
import tickets from "../data/tickets/tickets";

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

type ID = Types.ObjectId | String

export class TicketService {

    async findAndUpdateTicket(project: IProject, ticketId: ID, editorId: ID, payload: Partial<ITicketDocument>) {
        const ticket = (project.tickets as any).id(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        this.updateTicket(ticket, editorId, payload);
        await project.save();
        return ticket;
    }

    updateTicket(ticket: ITicket, editorId: ID, payload: Partial<ITicketDocument>) {
        const { status, subTasks, ...ticketPayload } = payload;
        // update paths
        ticket.set(payload);
        ticket.setSubTasks(payload.subTasks, Types.ObjectId(editorId.toString()));
        ticket.changeStatus(status, Types.ObjectId(editorId.toString()));
        ticket.setEditor(editorId);
        return ticket;
    }

    async createAndSaveTicket(project: IProject, ownerId: ID, payload: Object) {
        const ticket = this.createTicket(ownerId, payload);
        project.tickets.push(ticket);
        await project.save();
        return ticket;
    }

    createTicket(ownerId: ID, payload: Object) {
        return new TicketModel({ ...payload, owner: ownerId });
    }

    async findAndDeleteTicket(project: IProject, ticketId: Types.ObjectId | String) {
        const ticket = (project.tickets as any).id(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        ticket.remove();
        await project.save();
        return ticket;
    }

    async findTicketAndChangeStatus(project: IProject, status: TicketStatus, ticketId: ID, editorId: ID) {
        const ticket = (project.tickets as any).id(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        this.changeStatus(ticket, status, editorId);
        await project.save();
        return ticket;
    }

    changeStatus(ticket: ITicket, status: TicketStatus, editorId: ID) {
        ticket.changeStatus(status, Types.ObjectId(editorId.toString()));
        ticket.setEditor(editorId);
        return ticket;
    }

    async findTicketAndChangeSubTasks(project: IProject, ticketId: ID, subTasks: { description: string, isDone: boolean }[], editorId: ID) {
        const ticket = (project.tickets as any).id(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        this.changeSubTasks(ticket, subTasks, editorId);
        await project.save();
        return ticket;
    }

    async changeSubTasks(ticket: ITicket, subTasks: { description: string, isDone: boolean }[], editorId: String | Types.ObjectId) {
        const id = mongoose.Types.ObjectId(editorId.toString());
        ticket.setSubTasks(subTasks, id);
        ticket.setEditor(editorId);
        return ticket;
    }

    async getTickets(match = {}, sort = {}, pagination = {}) {
        const stages = prepareAggregateStages(match, sort, pagination);
        console.log('stages', stages);
        const result = await ProjectModel
            .aggregate(stages) as ITicket[];
        const tickets = await TicketModel.populate(result, { path: 'owner assignedto lastEditor' });
        console.log('tickets', tickets);
        return tickets;
    }


    async groupTicketsByStatus(pagination: PaginationParams = { pageIndex: 0, pageSize: Number.MAX_VALUE }, match: object = {}, sort: SortParams = {}) {
        
        const stages = prepareAggregateStages(match, sort, pagination);
        const result = await ProjectModel.aggregate(stages) as ITicket[];

        //console.log('aggregation result', result);
        const tickets = await TicketModel.populate(result, { path: 'owner assignedto lastEditor' });
        //console.log('tickets', tickets);

        const openTickets = [], activeTickets = [], closedTickets = [];
        for (let ticket of tickets) {
            if (ticket.status === TicketStatus.OPEN) {
                openTickets.push(ticket);
            } else if (ticket.status === TicketStatus.ACTIVE) {
                activeTickets.push(ticket);
            } else if (ticket.status === TicketStatus.CLOSED) {
                closedTickets.push(ticket);
            }
        }
        return { openTickets, activeTickets, closedTickets };
    }

    generateQueryObjects(query: TicketParams) {
        return {
            options: pagination(query),
            sort: remapObject(sort(query), 'tickets'),
            match: remapObject(filter(query), 'tickets')
        }
    }
}

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

export function sort(query: SortParams) {
    const { sortBy, sortDir } = query;
    const sort = {}

    if (sortBy && sortDir && ['asc', 'desc'].includes(sortDir)) {
        sort[sortBy] = ((sortDir === 'asc') ? 1 : -1);
    }
    return sort;
}

export function filter(query: FilterParams) {
    // filter by category, system, status
    const { openSelected, progressSelected, closedSelected } = query;
    const statusArr: TicketStatus[] = [];
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

    const filters = ['priority', 'status', 'category'];
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
function remapObject(obj: object, fieldname: string) {
    const mappedObj = {};
    for (let key of Object.keys(obj)) {
        mappedObj[fieldname + '.' + key] = obj[key];
    }
    return mappedObj;
}

function isEmpty(obj: object) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function prepareAggregateStages(match: object, sort: SortParams, pagination: PaginationParams) {

    // IMPORTANT: Order of adding objects is essential for correct aggregate
    // 1 $sort; 2 $match; 3 $limit; 4 $skip; 5 $unwind; 6 $match; 7 $project
    const aggregates = [];

    if (!isEmpty(sort)) {
        // 1 $sort
        aggregates.push({ $sort: sort });
    }
    // 2 $match
    aggregates.push({ $match: match })

    const { pageIndex, pageSize } = pagination;
    if (pageIndex) {
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

    const projection = {};
    ticketSchema.eachPath((path) => {
        projection[path] = `$tickets.${path}`;
    })
    // 7 $project
    aggregates.push({$project: projection});

    return aggregates;

}