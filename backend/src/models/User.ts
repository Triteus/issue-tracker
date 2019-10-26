import mongoose from 'mongoose';
import Role, { IRole } from './Role';
import {RoleSchema} from './Role';
// no ts-definition
require('mongoose-type-email');

export interface IUser extends mongoose.Document {
    email: string,
    password: string,
    roles: Array<IRole>
}

const userSchema = new mongoose.Schema({
    email: {
        type: (mongoose.SchemaTypes as any).Email,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    roles: {
        type: [RoleSchema],
        default: []
    }
})

export default mongoose.model<IUser>('User', userSchema);