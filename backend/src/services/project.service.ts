import { ProjectModel } from "../models/project.model";
import { Types } from "mongoose";
import { IService } from "../ServiceInjector";

export class ProjectService implements IService {

    findProjectsByAssignedUser(userId: string | Types.ObjectId) {
        return ProjectModel.find({ assignedUsers: { $in: [userId] } });
    }

    async countAllTickets(): Promise<number> {
        const result = await ProjectModel.aggregate([
            { $unwind: '$tickets' },
            { $count: 'numTickets' }
        ]);
        return (result && result[0]) ? result[0].numTickets : 0;
    }

}