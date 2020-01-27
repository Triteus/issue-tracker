import { Schema, model, Types } from "mongoose";
import { userSchema } from "./user.model";

export interface ISubTask {
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
  })
  


  export const SubTaskModel =  model('SubTask', subTaskSchema);