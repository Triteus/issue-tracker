import { Request } from "express";
import { IUserDocument, ERole } from "../models/User";
import { Types } from "mongoose";

export function isAccOwner(userId: Types.ObjectId | String, ownerId: Types.ObjectId | String) {
    return userId.toString() === ownerId.toString();
}

export function hasSupportRole(req: Request & {user: IUserDocument}) {
    return req.user.roles.includes(ERole.Support);
}
