import { Document } from "mongoose";
export interface IQuestions extends Document {
    title: String,
    questions:[
        {
            text:String,
            type:String,
            answer:[]
        }
    ]

}

