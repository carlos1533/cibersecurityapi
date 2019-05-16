import { IUser } from './interfaces/user.interface';
import { Model, PassportLocalModel } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';
import { IUsersService } from './interfaces/iUsers.service';
import { CreateUserDto } from './DTOs/createUser.dto';
import { LoginUserDto } from './Dtos/loginUser.dto';
import { JwtPayload } from 'src/shared/auth/interfaces/jwt-payload.interface';
import { LoginResponse } from './DTOs/login-response.dto';
import { genSalt, hash, compare } from 'bcrypt';
import { AuthService } from 'src/shared/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User')
  private userModel: Model<IUser>,
    @Inject(forwardRef(() => AuthService)) readonly _authService: AuthService, ) { }

  //login
  async login(loginDTO: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginDTO;
    const user = await this.findOne({ email });
    if (!user) {
      throw new HttpException('Credenciales incorrectas', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Credenciales incorrectas, error en constraseña.', HttpStatus.BAD_REQUEST);
    }
    const payload: JwtPayload = {
      email: user.email
    };

    const token = await this._authService.signPayload(payload);
    let loginResponseDTO = await this
      ._authService
      .validatePayload(payload)

    return {
      token,
      user: loginResponseDTO,
    };
  }



  async register(createUserDto: CreateUserDto): Promise<IUser> {
    //const { email, password, name, lastName } = createUserDto;
    const newUser = new this.userModel(createUserDto);

    const salt = await genSalt(10);
    newUser.password = await hash(createUserDto.password, salt);
    try {
      const result = await newUser.save();
      return result.toJSON() as IUser;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(): Promise<IUser[]> {
    return await this.userModel.find().exec();
  }

  async findOne(options: object): Promise<IUser> {
    return await this.userModel.findOne(options).exec();
  }

  async findById(ID: number): Promise<IUser> {
    return await this.userModel.findById(ID).exec();
  }
  /*
    async create(createUserDto: CreateUserDto) {
      let createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    }
  */
  async update(ID: number, newValue: IUser): Promise<IUser> {
    const user = await this.userModel.findById(ID).exec();
    /*
        if (!user._id) {
          debug('user not found');
        }
    */
    await this.userModel.findByIdAndUpdate(ID, newValue).exec();
    return await this.userModel.findById(ID).exec();
  }
  async delete(ID: number): Promise<string> {
    try {
      await this.userModel.findByIdAndRemove(ID).exec();
      return 'The user has been deleted';
    }
    catch (err) {
      debug(err);
      return 'The user could not be deleted';
    }
  }
  async findOneByEmail(email): Promise<IUser> {

    return await this.userModel.findOne({ email: email });

  }
}