import * as mongoose from 'mongoose';
export const questionSchema = new mongoose.Schema({
  title: String,
  questions:[
      {
          text:String,
          type:String,
          answer:[]
      }
  ]
});
