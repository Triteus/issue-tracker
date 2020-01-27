import mongoose, { Model, Types, Schema as MongooseSchema, Schema } from 'mongoose';
import { ITicketDocument, ticketSchema, ITicket } from './ticket.model';

type ID = String | Types.ObjectId;

export enum ProjectType {
    DESIGN = 'design',
    PLANNING = 'planning',
    REQUIREMENTS = 'requirements',
    ARCHITECTURE = 'architecture',
    PROTOTYPING="prototyping",
    DEV = 'dev',
    TESTING = 'testing',
    PROD = 'prod',
    INFRA = 'infra',
    OTHER = 'other'
}
export const projectTypeArr = Object.values(ProjectType);

export enum ProjectStatus {
    OPEN = 'open',
    ACTIVE = 'active',
    FINISHED = 'closed',
    DEFERRED = 'deferred',
    ABORTED = 'aborted'
}
export const projectStatusArr = Object.values(ProjectStatus);

export interface IProjectDocument extends mongoose.Document {
    id: Types.ObjectId,
    name: string,
    tickets: [ITicket],
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
    toMinimizedJSON: (projects: IProject[]) => IProjectDocument & {numTickets: number}
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
    type: {
        type: String,
        enum: projectTypeArr,
        default : ProjectType.OTHER
    },
    status: {
        type: String,
        enum: projectStatusArr,
        default: ProjectStatus.OPEN
    },
    tickets: {
        type: [ticketSchema],
        default: []
    },
    assignedUsers: {
        type: [{type: MongooseSchema.Types.ObjectId, ref: 'User'}],
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

/** exclude unused subdocs to decrease response size */
projectSchema.statics.toMinimizedJSON = function(projects: IProject[]) {
    return projects.map((p) => {
        const numTickets = p.tickets.length;
        // exclude tickets
        p.set('tickets', []);
        return {...p.toJSON(), numTickets};
    });
}

export const ProjectModel =  mongoose.model<IProject, IProjectModel>('Project', projectSchema);