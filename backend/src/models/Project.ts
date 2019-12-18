import mongoose, { Model, Types, Schema as MongooseSchema, Schema } from 'mongoose';
import { ITicketDocument, ticketSchema } from './Ticket';

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


export const ProjectModel =  mongoose.model<IProject, IProjectModel>('Project', projectSchema);