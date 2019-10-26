import mongoose from 'mongoose';


export interface IIssue extends mongoose.Document {
  ownerId: mongoose.Schema.Types.ObjectId,
  editorIds: mongoose.Schema.Types.ObjectId[],
  priority: number,
  criticality: string,
  title: string,
  description: string,
  status: ['open', 'active', 'closed'],
  created: Date,
  lastEdited: Date
}

const issueSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  editorIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
    enum: ['open', 'active', 'closed'],
    default: 'open'
  },
  created: Date,
  lastEdited: Date,
});

export default mongoose.model<IIssue>('Issue', issueSchema);