
import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { SignOptions, sign } from 'jsonwebtoken';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../../profile/users/users.service';
import { IUser } from '../../profile/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  private readonly jwtOptions: SignOptions;
  private readonly jwtKey: string;
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService) {

    this.jwtOptions = { expiresIn: '12h' };
    this.jwtKey = 'ilovePokemonAndGameOfTHrones';

  }


  async signPayload(payload: JwtPayload): Promise<string> {
    return sign(payload, this.jwtKey, this.jwtOptions);
  }

  async validatePayload(payload: JwtPayload): Promise<IUser> {
    return this.usersService.findOne({
      name: payload.name.toLocaleLowerCase()
    });
  }
  /*
  async validateUserByJwt(payload: JwtPayload) {
  
    // This will be used when the user has already logged in and has a JWT
    let user = await this.usersService.findOneByEmail(payload.email);
  
    if (user) {
      return this.createJwtPayload(user);
    } else {
      throw new UnauthorizedException();
    }
  
  }
   
    createJwtPayload(user) {
   
      let data: JwtPayload = {
        email: user.email
      };
   
      let jwt = this.jwtService.sign(data);
   
      return {
        expiresIn: 3600,
        token: jwt
      }
   
    }
  */
}