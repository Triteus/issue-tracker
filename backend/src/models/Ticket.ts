import mongoose, { Model, Types, Mongoose } from 'mongoose';
import { subTaskSchema, ISubTask } from './SubTask';
import { commentSchema, ICommentDocument, IComment } from './Comment';


export enum TicketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ACTIVE = 'active'
}
export const ticketStatusArr = Object.values(TicketStatus);

export enum TicketCategory {
  BUG = 'bug',
  FEATURE = 'feature',
  REQUEST = 'request',
  SUGGESTION = 'suggestion',
  INFO = 'info',
  OTHER = 'other'
}
export const ticketCategoryArr = Object.values(TicketCategory);

export enum Priority {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very high'
}

export const priorityArr = Object.values(Priority);


export interface ITicketDocument extends mongoose.Document {
  owner: mongoose.Types.ObjectId,
  editors?: mongoose.Types.ObjectId[],
  editorHistory: TicketHistory[],
  lastEditor?: mongoose.Types.ObjectId,
  assignedTo?: mongoose.Types.ObjectId,
  priority: Priority,
  neededAt?: Date,
  title: string,
  description: string,
  status?: TicketStatus,
  subTasks?: ISubTask[],
  affectedSystems?: string[],
  createdAt?: Date,
  updatedAt?: Date,
  filenames?: string[],
  comments: IComment[]
}

export interface ITicket extends ITicketDocument {
  setSubTasks: (subTasks: { description: string, isDone: boolean }[], editorId: Types.ObjectId) => void,
  setEditor: (editorId: mongoose.Types.ObjectId | String) => void
  setEditorAndSave: (editorID: mongoose.Types.ObjectId | String) => Promise<ITicket>,
  changeStatus: (status: TicketStatus, editorId: Types.ObjectId) => void,
  addEditorHistory: (history: TicketHistory) => void
  addEditorHistoryAndSave: (history: TicketHistory) => Promise<ITicket>
}

export interface ITicketModel extends Model<ITicket> {
  toJSON: (tickets: ITicket[]) => ITicketDocument[];
  populateTickets: (tickets: ITicket[]) => Promise<ITicket[]>;
}

export const ticketHistorySchema = new mongoose.Schema({
  editorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  editedAt: Date,
  changedPaths: [{path: String, oldValue: String, newValue: String }]

})

export interface TicketHistory {
  editorId: Types.ObjectId | string,
  editedAt: Date,
  changedPaths: {path: string, oldValue: string, newValue: string}[]
}

export const ticketSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    immutable: true
  },
  editors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  editorHistory: { 
    type: [ticketHistorySchema],
    default: []
  },
  lastEditor:
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
  category: {
    type: String,
    enum: ticketCategoryArr,
    default: TicketCategory.OTHER
  },
  subTasks: {
    type: [subTaskSchema],
    default: []
  },
  affectedSystems: {
    type: [{type: String, lowercase: true}],
    default: [],
  },
  filenames: {
    type: [String],
    default: []
  },
  comments: {
    type: [commentSchema],
    default: []
  }
}, {
  toJSON: {
    virtuals: true, versionKey: false, transform: function (doc, ret) {
      delete ret._id;
      ret.editorHistory = ret.editorHistory.map((hist) => {
        const editor = hist.editorId;
        delete hist.editorId;
        return {...hist, editor};
      })
      if(ret.neededAt) {
        ret.neededAt = ret.neededAt.toJSON();
      }
    }
  },
  toObject: { virtuals: true },
  timestamps: true
});

ticketSchema.index({title: 'text'});

ticketSchema.methods.setSubTasks = function (subTasks: { description: string, isDone: boolean }[], editorId: mongoose.Types.ObjectId) {
  if(!subTasks) return;
  this.subTasks = subTasks;
}

ticketSchema.methods.setEditor = function (editorId: mongoose.Types.ObjectId) {
  this.lastEditor = editorId;
  this.editors.push(editorId);
}

ticketSchema.methods.setEditorAndSave = async function (editorId: mongoose.Types.ObjectId) {
  this.setEditor(editorId);
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

ticketSchema.methods.addEditorHistory = function (history: TicketHistory) {
  this.editorHistory.push(history);
}

ticketSchema.methods.addEditorHistoryAndSave = async function (history: TicketHistory) {
  this.addHistory(history);
  return this.save();
}

ticketSchema.statics.toJSON = function (tickets: ITicket[]) {
  const TicketModel = mongoose.models['Ticket'];
  return tickets.map((ticket) => {
    return new TicketModel(ticket).toJSON();
  });
}

ticketSchema.statics.populateTickets = async function (tickets: ITicket[]) {
  const TicketModel = mongoose.models['Ticket'];
  return TicketModel.populate(tickets, { path: 'owner assignedto lastEditor' });
}

ticketSchema.virtual("id").get(function (this: { _id: string}) {
  return this._id;
});


export default mongoose.model<ITicket, ITicketModel>('Ticket', ticketSchema);