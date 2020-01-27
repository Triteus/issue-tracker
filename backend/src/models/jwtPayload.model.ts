import { Types } from "mongoose";

export interface JwtPayload {
    id: Types.ObjectId,
    email: string,
    username: string,
    roles: string[]
}