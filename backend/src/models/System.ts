import mongoose from 'mongoose';


export const systemSchema = new mongoose.Schema({
  name: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System',
  },
});


export const SystemModel = mongoose.model('System', systemSchema);
