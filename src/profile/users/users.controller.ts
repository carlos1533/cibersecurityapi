import { Controller, Get, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './Dtos/createUser.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginResponse } from './DTOs/login-response.dto';
import { LoginUserDto } from './Dtos/loginUser.dto';
import { IUser } from './interfaces/user.interface';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {

  }
  /*
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
      return await this.usersService.create(createUserDto);
    }
  */
  @Post('/registro')
  async register(@Body() user: IUser): Promise<IUser> {
    const { email } = user;
    let exist: IUser;
    try {
      exist = await this
        .usersService
        .findOne({ email });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (exist) {
      throw new HttpException({
        message: `El correo ${email} ya esta registrado.`,
        property: 'email'
      }, HttpStatus.BAD_REQUEST);
    }
    const newUser = await this
      .usersService
      .register(user);
    return newUser
  }
  @Post('login')
  async login(@Body() loginDTO: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginDTO;
    if (!email || !password) {
      throw new HttpException(`Email y password es requerido.`, HttpStatus.BAD_REQUEST);
    }
    return this
      .usersService
      .login(loginDTO);
  }

}