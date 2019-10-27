import mongoose from 'mongoose';

// no ts-definition
require('mongoose-type-email');


export enum ERole {
    Admin = 'admin',
    Support = 'support'
}

export interface IUser extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
    password: string,
    roles: Array<ERole>
}

const userSchema = new mongoose.Schema({
    email: {
        type: (mongoose.SchemaTypes as any).Email,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },
    roles: {
        type: [String],
        default: [],
        enum: Object.keys(ERole).map(k => ERole[k])
    }
})

export default mongoose.model<IUser>('User', userSchema);