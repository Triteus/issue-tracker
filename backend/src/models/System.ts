import mongoose from 'mongoose';


const systemSchema = new mongoose.Schema({
  name: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'System',
  },
});


export default mongoose.model('System', systemSchema);
