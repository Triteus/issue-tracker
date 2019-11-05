import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";


export class TicketService {

    async findAndUpdateTicket(ticketId: Types.ObjectId | String, editorId: Types.ObjectId | String, payload: Partial<ITicketDocument>) {
        const ticket = await TicketModel.findById(ticketId);
        if(!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
       return this.updateTicket(ticket, editorId, payload);
    }

    async updateTicket(ticket: ITicket, editorId: Types.ObjectId | String, payload: Partial<ITicketDocument>) {
        const {status, ...ticketPayload} = payload;
        // update paths
        ticket.set(payload);
        // update status
        return this.changeStatus(ticket, status, editorId);
    }

    async createTicket(ownerId: Types.ObjectId | String, payload: Partial<ITicketDocument>) {
        return TicketModel.create({...payload, ownerId});
    }

    async findAndDeleteTicket(ticketId: Types.ObjectId | String) {
        const ticket = await TicketModel.findById(ticketId);
        if(!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        return ticket.remove();
    }

    async findTicketAndChangeStatus(status: TicketStatus, ticketId: String | Types.ObjectId, editorId: String | Types.ObjectId) {
        const ticket = await TicketModel.findById(ticketId);
        if (!ticket) {
            throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
        }
        
        ticket.status = status;
        return ticket.addEditorAndSave(editorId);
    }

    async changeStatus(ticket: ITicket, status: TicketStatus, editorId: String | Types.ObjectId) {
        ticket.status = status;
        return ticket.addEditorAndSave(editorId);
    }

    async deleteExistingTicket(ticket: ITicket) {
        return ticket.remove();
    }
}