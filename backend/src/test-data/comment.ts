import { Types } from "mongoose";

export function commentData() {
    return {
        message: 'a test comment',
        userId: Types.ObjectId()
    }
}