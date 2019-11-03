import mongoose, { Model } from 'mongoose';
import { subTaskSchema, ISubTask } from './SubTask';
import { systemSchema } from './System';


export enum TicketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ASSIGNED = 'assigned',
  ACTIVE = 'active'
}

export const ticketStatusArr = Object.values(TicketStatus);

export interface ITicketDocument extends mongoose.Document {
  ownerId: mongoose.Types.ObjectId,
  editorIds: mongoose.Types.ObjectId[],
  lastEditorId: mongoose.Types.ObjectId,
  priority: number,
  criticality: number,
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
  priority: {
    type: Number,
    default: 0
  },
  criticality: {
    type: Number,
    default: 0
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
    type: [systemSchema],
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