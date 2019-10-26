import mongoose from 'mongoose';


export interface IRole extends mongoose.Document {
    name: string,
    parentId: mongoose.Schema.Types.ObjectId
}

const roleSchema = new mongoose.Schema({
    name: String,
    parentId: {
        ref: 'Role',
        type: mongoose.Schema.Types.ObjectId
    }
})

export default mongoose.model<IRole>('Role', roleSchema);

export const RoleSchema = roleSchema;