import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus, Priority, ticketSchema } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";
import mongoose from 'mongoose';
import { IProject, ProjectModel } from "../models/Project";
import { prepareAggregateStages, pagination, remapObject, sort, filter, withProjectId } from "./ticket.service.util";

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

    async getTickets(project: IProject, match: object = {}, sort: SortParams = {}, pagination: PaginationParams = {}) {
        // make sure to only aggregate on specific project
        match = withProjectId(match, project._id);

        const stages = prepareAggregateStages(match, sort, pagination);
        const result = await ProjectModel
            .aggregate(stages) as ITicket[];
        const tickets = await TicketModel.populate(result, { path: 'owner assignedto lastEditor' });
        return tickets;
    }


    async groupTicketsByStatus(project: IProject, pagination: PaginationParams = { pageIndex: 0, pageSize: Number.MAX_VALUE }, match: object = {}, sort: SortParams = {}) {
        // make sure to only aggregate on specific project
        match = withProjectId(match, project._id);

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

