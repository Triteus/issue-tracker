import { Types } from "mongoose";
import TicketModel, { ITicketDocument, ITicket, TicketStatus, Priority, ticketSchema, ticketHistorySchema, TicketHistory } from "../models/Ticket";
import { ResponseError, ErrorTypes } from "../middlewares/error";
import mongoose from 'mongoose';
import { IProject, ProjectModel } from "../models/Project";
import { prepareAggregateStages, pagination, remapObject, sort, filter, withProjectId, PreparedSortParams, PaginationParams, TicketParams, PreparedPaginationParams } from "./ticket.service.util";
import { arrayEquals } from "../util/array";


type ID = Types.ObjectId | string

export class TicketService {


  async findTicketAndAddHistory(project: IProject, ticketId: ID, editorId: ID, payload: Partial<ITicketDocument>) {

    const ticket = (project.tickets as any).id(ticketId) as ITicket;
    if (!ticket) {
      throw new ResponseError('Ticket not found!', ErrorTypes.NOT_FOUND);
    }

    const history = this.createEditorHistory(ticket, editorId, payload);
    if (history.changedPaths.length > 0) {
      return ticket.addEditorHistoryAndSave(history);
    }
    return ticket;
  }

  addHistory(ticket: ITicket, editorId: ID, payload: Partial<ITicketDocument>) {
    const history = this.createEditorHistory(ticket, editorId, payload);
    if (history.changedPaths.length > 0) {
      ticket.addEditorHistory(history);
    }
    return ticket;
  }

  createEditorHistory(ticket: ITicket, editorId: ID, payload: Partial<ITicketDocument>) {
    const keys = ['status', 'type', 'assignedTo', 'priority', 'title', 'description']
    const date = new Date();
    let history: TicketHistory = { editorId, editedAt: date, changedPaths: [] };

    for (let path of keys) {
      if (payload[path] && payload[path] !== ticket[path]) {
        history.changedPaths.push({ path, oldValue: ticket[path], newValue: payload[path] });
      }
    }
    if (payload['affectedSystems'] && !arrayEquals(payload['affectedSystems'], ticket['affectedSystems'])) {
      history.changedPaths.push({
        path: 'affectedSystems',
        oldValue: ticket['affectedSystems'].join(),
        newValue: payload['affectedSystems'].join()
      })
    }

    //TODO handle history of subtasks

    return history;
  }

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

  async getTickets(project: IProject, match: object = {}, sort: PreparedSortParams = {}, pagination: PreparedPaginationParams = {}) {
    // make sure to only aggregate on specific project
    match = withProjectId(match, project._id);

    const stages = prepareAggregateStages(match, sort, pagination);
    const result = await ProjectModel
      .aggregate(stages) as ITicket[];
    const tickets = await TicketModel.populateTickets(result);
    return tickets;
  }


  async groupTicketsByStatus(project: IProject, pagination: PreparedPaginationParams = { skip: 0, limit: Number.MAX_SAFE_INTEGER }, match: object = {}, sort: PreparedSortParams = {}) {
    // make sure to only aggregate on specific project
    match = withProjectId(match, project._id);

    const stages = prepareAggregateStages(match, sort, pagination);
    const result = await ProjectModel.aggregate(stages) as ITicket[];

    const tickets = await TicketModel.populateTickets(result);

    //TODO do this while aggregating (group)
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

  async countTickets(project: IProject, match: object = {}) {
    // make sure to only aggregate on specific project
    match = withProjectId(match, project._id);
    const result = await ProjectModel.aggregate([
      { $unwind: '$tickets' },
      { $match: match },
      { $count: 'numTickets' }
    ])
    return result && result[0] ? result[0].numTickets : 0;
  }
}

