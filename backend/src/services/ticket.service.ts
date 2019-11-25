import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus, Priority } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";
import mongoose from 'mongoose';

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
    pageSize?: string| number;
}

export interface SortParams {
    sortDir?: string;
    sortBy?: string;
}

export type TicketParams = FilterParams & PaginationParams & SortParams;


export class TicketService {

    async findAndUpdateTicket(ticketId: Types.ObjectId | String, editorId: Types.ObjectId | String, payload: Object) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return this.updateTicket(ticket, editorId, payload);
    }

    async updateTicket(ticket: ITicket, editorId: Types.ObjectId | String, payload: Partial<ITicketDocument>) {
        const { status, subTasks, ...ticketPayload } = payload;
        // update paths
        ticket.set(payload);
        ticket.setSubTasks(payload.subTasks, Types.ObjectId(editorId.toString()));
        ticket.changeStatus(status, Types.ObjectId(editorId.toString()));
        return ticket.setEditorAndSave(editorId);
    }

    async createTicket(ownerId: Types.ObjectId | String, payload: Object) {
        return TicketModel.create({ ...payload, owner: ownerId });
    }

    async findAndDeleteTicket(ticketId: Types.ObjectId | String) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return ticket.remove();
    }

    async deleteExistingTicket(ticket: ITicket) {
        return ticket.remove();
    }

    async findTicketAndChangeStatus(status: TicketStatus, ticketId: String | Types.ObjectId, editorId: String | Types.ObjectId) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return this.changeStatus(ticket, status, editorId);
    }

    async changeStatus(ticket: ITicket, status: TicketStatus, editorId: String | Types.ObjectId) {
        ticket.changeStatus(status, Types.ObjectId(editorId.toString()));
        await ticket.setEditorAndSave(editorId);
    }

    async findTicketAndChangeSubTasks(ticketId: String | Types.ObjectId, subTasks: { description: string, isDone: boolean }[], editorId: String | Types.ObjectId) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return this.changeSubTasks(ticket, subTasks, editorId);
    }

    async changeSubTasks(ticket: ITicket, subTasks: { description: string, isDone: boolean }[], editorId: String | Types.ObjectId) {
        const id = mongoose.Types.ObjectId(editorId.toString());
        ticket.setSubTasks(subTasks, id);
        return ticket.setEditorAndSave(editorId);
    }

    async addEditorAndSave(ticket: ITicket, editorId: String | Types.ObjectId) {
        return ticket.setEditorAndSave(editorId);
    }

    async findAndGroupTicketsByStatus(options: Partial<PaginationParams>) {
        const tickets = await TicketModel.find({}, null, options);
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
            sort: sort(query),
            match: filter(query)
        }
    }
}

export function pagination(query: PaginationParams) {
    const pageIndex = Number.parseInt(query.pageIndex as string);
    const pageSize = Number.parseInt(query.pageSize as string);
    let options = {};
    if (Number.isInteger(pageIndex) && Number.isInteger(pageSize)
        && pageIndex > 0 && pageSize > 0) {
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
        updatedAt: { $gte: query.editedDateStart || 0, $lte: query.editedDateEnd || new Date().toJSON() }
    };

    if(query.filter){
      match['title'] =  { $regex: `.*${query.filter}.*`, $options: 'i' }; 
    } 

    if (query.systems) {
        // make sure value is an array for query
        let systems = query.systems;
        if(Array.isArray(systems)) {
            systems = systems.map((s: string) => s.toLowerCase());
        } else {
            systems = [systems.toLowerCase()];
        }
        match['affectedSystems'] = { $in: systems }
    }

    const filters = ['priority', 'status'];
    for (let filter of filters) {
        if (query[filter]) {
            match[filter] = query[filter];
        }
    }
    return match;
}
