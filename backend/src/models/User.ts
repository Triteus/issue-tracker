import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// no ts-definition
require('mongoose-type-email');
import config from 'config';

import { Request } from 'express';
import { IUser } from './User';


export type RequestWithUser = Request & {user: IUser};

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
    username: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IUser extends IUserDocument {
    comparePassword(pw: string): Promise<boolean>,
    generateToken(): string
}

export interface IUserModel extends Model<IUser> {
    hashPassword(pw: string): Promise<string>;
}

export const userSchema = new mongoose.Schema({
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
    toJSON: { virtuals: true, versionKey: false,  transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
      } },
    toObject: { virtuals: true },
    timestamps: true
})

userSchema.methods.comparePassword = function (pw: string) {
    return bcrypt.compare(pw, this.password);
}

userSchema.methods.generateToken = function () {
    const userJSON = { _id: this.id, email: this.email, roles: this.roles, username: this.username };
    // generate web token
    return jwt.sign(userJSON, config.get('secretKey'));
}

userSchema.statics.hashPassword = async function (plainPW: string) {
    // hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainPW, salt);
}

// instead of 'save'-hook, we use validate hook to be able to unit test
userSchema.pre('validate', async function (next) {
    const user = this as any;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
})

userSchema.virtual("username").get(function (this: { firstName: string, lastName: string }) {
    return this.firstName + " " + this.lastName;
});

export default mongoose.model<IUser, IUserModel>('User', userSchema);