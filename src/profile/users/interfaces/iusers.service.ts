import { LoginResponse } from './../DTOs/login-response.dto';
import { IUser } from './user.interface';

export interface IUsersService {
  findAll(): Promise<IUser[]>;
  findById(ID: number): Promise<IUser | null>;
  findOne(options: object): Promise<IUser> | null;
  create(user: IUser): Promise<IUser>;
  update(ID: number, newValue: IUser): Promise<IUser | null>;
  delete(ID: number): Promise<string>;
  findOneByEmail(email: string): Promise<IUser> | null;
  login(loginresponse: LoginResponse): Promise<LoginResponse> | null;
}