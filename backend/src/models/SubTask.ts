import { Schema, model } from "mongoose";
import { userSchema } from "./User";

export interface ISubTask {
    index: number,
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
    editorID: {
        type: userSchema,
        ref: 'User'
    }
  })
  


  export const SubTaskModel =  model('SubTask', subTaskSchema);