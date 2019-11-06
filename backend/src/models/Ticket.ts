import mongoose, { Model, Types, Mongoose } from 'mongoose';
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
  subTasks: ISubTask[],
  createdAt: Date,
  editedAt: Date
}

export interface ITicket extends ITicketDocument {
  setSubTasks: (subTasks: { description: string, isDone: boolean }[], editorId: Types.ObjectId) => void,
  addEditor: (editorId: mongoose.Types.ObjectId | String) => void
  addEditorAndSave: (editorID: mongoose.Types.ObjectId | String) => Promise<ITicket>,
  changeStatus: (status: TicketStatus, editorId: Types.ObjectId) => void
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


ticketSchema.methods.setSubTasks = function (subTasks: { description: string, isDone: boolean }[], editorId: mongoose.Types.ObjectId) {
  if(!subTasks) return;
  this.subTasks = subTasks.map(task => ({ ...task, editorId }));
}

ticketSchema.methods.addEditor = function (editorId: mongoose.Types.ObjectId) {
  this.lastEditorId = editorId;
  this.editorIds.push(editorId);
}

ticketSchema.methods.addEditorAndSave = async function (editorId: mongoose.Types.ObjectId) {
  this.addEditor(editorId);
  return this.save();
}

ticketSchema.methods.changeStatus = function (status: TicketStatus, editorId: mongoose.Types.ObjectId): void {
  if (status === this.status) {
    return;
  }
  if (status === TicketStatus.CLOSED || status === TicketStatus.OPEN) {
    this.assignedTo = null;
  } else {
    this.assignedTo = mongoose.Types.ObjectId(editorId.toString());
  }
  this.status = status;
}

export default mongoose.model<ITicket, ITicketModel>('Ticket', ticketSchema);