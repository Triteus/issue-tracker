import mongoose, { Model, Types, Schema as MongooseSchema, Schema } from 'mongoose';
import { ITicketDocument, ticketSchema } from './Ticket';


type ID = String | Types.ObjectId;

export interface IProjectDocument extends mongoose.Document {
    id: Types.ObjectId,
    name: string,
    tickets: [ITicketDocument],
    assignedUsers: [Types.ObjectId],
    projectLeader: Types.ObjectId,
    filenames: string[],
    createdAt: Date,
    updatedAt: Date,
}

export interface IProject extends IProjectDocument {
    addUserToProject: (userId: ID) => void;
    addUserToProjectAndSave: (userId: ID) => Promise<IProject>;
    removeUserFromProject: (userId: ID) => void;
    removeUserFromProjectAndSave: (userId: ID) => Promise<IProject>;
    addProjectLeader: (leaderId: ID) => void;
    addProjectLeaderAndSave: (leaderId: ID) => Promise<IProject>;
}

export interface IProjectModel extends Model<IProject> {

}


export const projectSchema = new MongooseSchema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    tickets: {
        type: [ticketSchema],
        default: []
    },
    assignedUsers: {
        type: [MongooseSchema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    projectLeader: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filenames: {
        type: [String],
        default: []
    },
}, {
    toJSON: {
        virtuals: true, versionKey: false, transform: function (doc, ret) {
            delete ret._id;
        }
    },
    toObject: { virtuals: true },
    timestamps: true
})

projectSchema.methods.removeUserFromProject = function (userId: ID) {
    this.assignedUsers = this.assignedUsers.filter((uid) => uid + '' !== userId + '');
}

projectSchema.methods.removeUserFromProjectAndSave = async function (userId: ID) {
    this.removeUserFromProject(userId);
    await this.save();
}

projectSchema.methods.addUserToProject = function(userId: ID) {
    this.assignedUsers.push(userId);
}

projectSchema.methods.addUserToProjectAndSave = async function(userId: ID) {
    this.addUserToProject(userId);
    await this.save();
}

projectSchema.methods.addProjectLeader = function (leaderId: ID) {
    this.projectLeader = leaderId;
    this.addUserToProject(leaderId);
}

projectSchema.methods.addProjectLeaderAndSave = async function (leaderId: ID) {
    this.addProjectLeader(leaderId);
    await this.save();
}


export const ProjectModel =  mongoose.model<IProject, IProjectModel>('Project', projectSchema);