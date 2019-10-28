import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
// no ts-definition
require('mongoose-type-email');


export enum ERole {
    Admin = 'admin',
    Support = 'support'
}

export interface IUserDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    roles: Array<ERole>,
    username: string
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
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
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
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

userSchema.methods.comparePassword = function (pw: string) {
    return bcrypt.compare(pw, this.password);
}

userSchema.statics.hashPassword = async function (plainPW: string) {
    // hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainPW, salt);
}

userSchema.virtual("username").get(function (this: { firstName: string, lastName: string }) {
    return this.firstName + " " + this.lastName;
});

export default mongoose.model<IUser, IUserModel>('User', userSchema);