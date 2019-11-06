import { Schema, model, Types } from "mongoose";
import { userSchema } from "./User";

export interface ISubTask {
    editorId: Types.ObjectId,
    description: string,
    isDone: boolean
}


export const subTaskSchema = new Schema({
    description: {
      required: true,
      type: String
    },
    isDone: {
      type: Boolean,
      default: false
    },
    editorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
  })
  


  export const SubTaskModel =  model('SubTask', subTaskSchema);