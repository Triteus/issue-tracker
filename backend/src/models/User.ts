import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
// no ts-definition
require('mongoose-type-email');


export enum ERole {
    Admin = 'admin',
    Support = 'support'
}

export interface IUserDocument extends mongoose.Document {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
    password: string,
    roles: Array<ERole>,
}

export interface IUser extends IUserDocument {
    comparePassword(pw: string): Promise<boolean>
}

export interface IUserModel extends Model<IUser> {
    hashPassword(pw: string): Promise<string>;
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

userSchema.methods.comparePassword = function(pw: string) {
    return bcrypt.compare(pw, this.password);
}

userSchema.statics.hashPassword = async function (plainPW: string) {
    // hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainPW, salt);
}

export default mongoose.model<IUser, IUserModel>('User', userSchema);