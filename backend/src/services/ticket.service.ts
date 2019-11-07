import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";
import mongoose from 'mongoose';

export class TicketService {

    async findAndUpdateTicket(ticketId: Types.ObjectId | String, editorId: Types.ObjectId | String, payload: Object) {
        const ticket = await TicketModel.findById(ticketId);
        if(!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
       return this.updateTicket(ticket, editorId, payload);
    }

    async updateTicket(ticket: ITicket, editorId: Types.ObjectId | String, payload: Partial<ITicketDocument>) {
        const {status, subTasks, ...ticketPayload} = payload;
        // update paths
        ticket.set(payload);
        ticket.setSubTasks(payload.subTasks, Types.ObjectId(editorId.toString()));
        ticket.changeStatus(status, Types.ObjectId(editorId.toString()));
        return ticket.addEditorAndSave(editorId);
    }

    async createTicket(ownerId: Types.ObjectId | String, payload: Object) {
        return TicketModel.create({...payload, ownerId});
    }

    async findAndDeleteTicket(ticketId: Types.ObjectId | String) {
        const ticket = await TicketModel.findById(ticketId);
        if(!ticket) {
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
        ticket.addEditor(editorId);
        await ticket.save();
    }

    async findTicketAndChangeSubTasks(ticketId: String | Types.ObjectId, subTasks: {description: string, isDone: boolean}[], editorId: String | Types.ObjectId) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return this.changeSubTasks(ticket, subTasks, editorId);
    }

    async changeSubTasks(ticket: ITicket, subTasks: {description: string, isDone: boolean}[], editorId: String | Types.ObjectId) {
        const id = mongoose.Types.ObjectId(editorId.toString());
        ticket.setSubTasks(subTasks, id);
        return ticket.addEditorAndSave(editorId);
    }

    async addEditorAndSave(ticket: ITicket, editorId: String | Types.ObjectId) {
        return ticket.addEditorAndSave(editorId);
    }
}