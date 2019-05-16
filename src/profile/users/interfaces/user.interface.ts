
import { Document } from "mongoose";
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  lastName: string;
  imageUrl?: string;

}

