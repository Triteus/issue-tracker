import mongoose, { Model } from 'mongoose';
import { subTaskSchema, ISubTask } from './SubTask';


export enum TicketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ACTIVE = 'active'
}
export const ticketStatusArr = Object.values(TicketStatus);


export enum Priority {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very high'
}

export const priorityArr = Object.values(Priority);


export interface ITicketDocument extends mongoose.Document {
  ownerId: mongoose.Types.ObjectId,
  editorIds: mongoose.Types.ObjectId[],
  lastEditorId: mongoose.Types.ObjectId,
  assignedTo: mongoose.Types.ObjectId,
  priority: Priority,
  neededAt: Date,
  title: string,
  description: string,
  status: TicketStatus,
  createdAt: Date,
  editedAt: Date
}

export interface ITicket extends ITicketDocument {
  addSubTasks: (subTasks: ISubTask[]) => void,
  addEditor: (editorId: mongoose.Types.ObjectId | String) => void
  addEditorAndSave: (editorID: mongoose.Types.ObjectId | String) => Promise<ITicket>
}

export interface ITicketModel extends Model<ITicket> {

}

export const ticketSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    immutable: true
  },
  editorIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  lastEditorId:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: priorityArr,
    default: Priority.LOW
  },
  neededAt: {
    type: Date,
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ticketStatusArr,
    default: TicketStatus.OPEN
  },
  subTasks: {
    type: [subTaskSchema],
    default: []
  },
  affectedSystems: {
    type: [String],
    default: []
  }
}, {
  toJSON: {
    virtuals: true, versionKey: false, transform: function (doc, ret) {
      delete ret._id;
    }
  },
  toObject: { virtuals: true },
  timestamps: true
});


ticketSchema.methods.addSubTasks = function (descriptions: string[]) {
  this.subTasks = descriptions.map(desc => ({ description: desc }));
}

ticketSchema.methods.addEditor = function (editorId: mongoose.Types.ObjectId) {
  this.lastEditorId = editorId;
  this.editorIds.push(editorId);
}

ticketSchema.methods.addEditorAndSave = async function (editorId: mongoose.Types.ObjectId) {
  this.addEditor(editorId);
  return this.save();
}



export default mongoose.model<ITicket, ITicketModel>('Ticket', ticketSchema);