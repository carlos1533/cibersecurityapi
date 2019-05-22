
import { Document } from "mongoose";
export interface IUser extends Document {
  password: string;
  name: string;
  lastName: string;
  imageUrl?: string;

}

