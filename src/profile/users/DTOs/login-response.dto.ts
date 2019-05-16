import { ApiModelProperty } from '@nestjs/swagger';
import { IUser } from '../interfaces/user.interface';

export class LoginResponse {
  token: string;
  user: IUser;
}