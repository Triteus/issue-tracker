import { Types } from "mongoose";
import { ProjectModel } from "../models/project.model";
import { ticketSchema, ITicket, ITicketDocument } from "../models/ticket.model";
import moment from "moment";
import { IService } from "../ServiceInjector";


type TicketWithProjectId = ITicketDocument & { projectId: string };

export class HomeService implements IService {

    async findLastTickets(numTickets: number, userId: string | Types.ObjectId): Promise<TicketWithProjectId[]> {

        const match = {
            $or: [
                { 'tickets.editors': { $in: [userId] } },
                { 'tickets.owner': userId }
            ]
        }

        const projection = {};
        ticketSchema.eachPath((path) => {
            projection[path] = `$tickets.${path}`;
        })

        return await ProjectModel.aggregate([
            { $match: match },
            { $unwind: '$tickets' },
            { $match: match },
            { $sort: { 'tickets.updatedAt': -1 } },
            { $limit: numTickets },
            { $project: { ...projection, projectId: '$_id' } }
        ]);
    }

    async countTicketsCreatedLastMonth() {
        const timeLastMonth = moment().subtract(1, 'months').toDate();
        const result = await ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $match: { 'tickets.createdAt': { $gte: timeLastMonth } } },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }

    async countTicketsCreatedLastWeek() {
        const timeLastWeek = moment().subtract(1, 'weeks').toDate();
        const result = await ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $match: { 'tickets.createdAt': { $gte: timeLastWeek } } },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }
}