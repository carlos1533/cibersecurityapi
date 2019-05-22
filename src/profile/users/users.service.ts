import { LoginUserDto } from './DTOs/loginUser.dto';
import { IUser } from './interfaces/user.interface';
import { Model, PassportLocalModel } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';

import { CreateUserDto } from './DTOs/createUser.dto';

import { JwtPayload } from '../../shared/auth/interfaces/jwt-payload.interface';
import { LoginResponse } from './DTOs/login-response.dto';
import { genSalt, hash, compare } from 'bcrypt';
import { AuthService } from '../../shared/auth/auth.service';
var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();
@Injectable()
export class UsersService {
  constructor(@InjectModel('User')
  private userModel: Model<IUser>,
    @Inject(forwardRef(() => AuthService)) readonly _authService: AuthService, ) { }

  //login
  async login(loginDTO: LoginUserDto): Promise<LoginResponse> {
    const { name, password } = loginDTO;
    const user = await this.findOne({ name });
    if (!user) {
      throw new HttpException('Credenciales incorrectas', HttpStatus.BAD_REQUEST);
    }
    console.log(password)
    const isMatch = await compare(password, user.password);
    //console.log(isMatch)
    if (!isMatch) {
      throw new HttpException('Credenciales incorrectas, error en constraseña.', HttpStatus.BAD_REQUEST);
    }
    const payload: JwtPayload = {
      name: user.name
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
  async reto01(loginDTO: LoginUserDto): Promise<string> {
    schema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits()                                 // Must have digits
      //.has().not().spaces()                           // Should not have spaces
      .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    let message = ""
    const lista = schema.validate(loginDTO.password, { list: true })
    for (let char of lista) {
      if (char == 'min') {
        message = 'No cumple el tamaño mínimo de 8 caracteres';
      } else if (char == 'oneOf' || char == 'min') {
        message = 'No cumple el tamaño mínimo de 8 caracteres y la contraseña es muy simple';
      } else if (char == 'oneOf' || char == 'min' || char == 'digits') {
        message = 'No cumple el tamaño mínimo de 8 caracteres , la contraseña es muy simple y no tiene dígitos!"';
      }
    }


    return message

  }
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
  async findOneByEmail(name): Promise<IUser> {

    return await this.userModel.findOne({ name: name });

  }
}