import { LoginUserDto } from './DTOs/loginUser.dto';
import { IUser } from './interfaces/user.interface';
import { IQuestions } from './interfaces/questions.interface';
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
  //private questionModel:Model<IQuestions>,
  private userModel: Model<IUser>,
    @Inject(forwardRef(() => AuthService)) readonly _authService: AuthService, ) { }

  //login
  async login(loginDTO: LoginUserDto): Promise<LoginResponse> {
    const { name, password } = loginDTO;
    const user = await this.findOne({ name });
    //console.log('usuario:' + user)
    if (!user) {
      throw new HttpException('Credenciales incorrectas', HttpStatus.BAD_REQUEST);
    }
    console.log(loginDTO.password)
    console.log(user.password)

    //const isMatch = await compare(password, user.password);
    //console.log(isMatch)
    if (loginDTO.password !== user.password) {
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
    //const { password, name } = createUserDto;
    const newUser = new this.userModel(createUserDto);

    const salt = await genSalt(10);
    //newUser.password = await hash(password, salt);
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
    .has().uppercase()
    .has().letters()
    .has().symbols()                              // Must have uppercase letters                            // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']);// Blacklist these values

    
  let message = ""
  let message2 = ""
  let message3 = ""
  let message4 = ""
  let message5 = ""
  let message6 = ""
  const lista = schema.validate(loginDTO.password, { list: true })
  //console.log(lista)
  
  for (let char of lista) {
    if (char == 'min') {
      message=', Tu contraseña es muy debil. Tu contraseña deberia tener mínimo 8 caracteres para que sea segura, ingresa una contraseña con 8 o más caracteres.';
    } 
    if (char == 'uppercase' ){
      message2= ',Muy bien, tu contraseña tiene 8 caracteres entre letras y numeros, pero para que sea más segura deberias usar Mayusculzas y minusculas, ingresa una contraseña de la misma longitud con letras y números y con mayuzculas.';  
    } 
    if (char == 'oneOf') {
      message3 = ', La contraseña es muy simple';
    }  
    if (char == 'digits') {
      message4 = ',Muy bien, tu contraseña tiene 8 caracteres entre letras y numeros y mayusculas, pero para que sea más segura deberia tener caracteres especiales ($#"$), ingresa una contraseña de la misma longitud con letras, números, con mayusculas y caracteres raros."';
    } 
    if (char == 'letters') {

      message5 = ',Muy bien, tu contraseña tiene 8 caracteres, pero para que sea más segura deberia usar letras y números, ingresa una contraseña de la misma longitud con letras y números.';
    }
    if(char=''){
      message5="Muy bien, tu contraseña es segura."

    }
     
    }
    return message+message2 +message3+message4+message5+ message6  
  }
    
  




    /*
    const pass_length = loginDTO.password.length;
    let contains_number=false;
    let contains_uppercase=false;
    let contains_special_character=false;
    let valid_password=false;
    let messageP = ""
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

      if (pass_length < 8) {
        messageP = 'No cumple el tamaño mínimo de 8 caracteres';
      }
      contains_number = /\d/.test(loginDTO.password);
      contains_uppercase = /[A-Z]/.test(loginDTO.password);
      contains_special_character = format.test(loginDTO.password);

      if (contains_number === false) {
        messageP = 'No tiene numeros';
      } else if ( /\d/.test(loginDTO.password)=== true && pass_length < 8){
        messageP = 'No cumple el tamaño mínimo de 8 caracteres';
      } else if (/\d/.test(loginDTO.password)=== true && pass_length > 8 &&
       /[A-Z]/.test(loginDTO.password)===false
      ){

    
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
  async findOneByEmail(name): Promise<IUser> {

    return await this.userModel.findOne({ name: name });

  }



  //quiz para el nivel 01

async getQuestions():Promise<any>{
    let questions = {
      title: "Quiz about Foo",
      questions: [
      {
      text: "Is true true?",
      type: "tf",
      answer: "t"
      },
      {
      text: "Is false true?",
      type: "tf",
      answer: "f"
      },
      {
      text: "What is the best beer?",
      type: "mc",
      answers: [
      "Coors",
      "Miller",
      "Bud",
      "Anchor Steam"
      ],
      answer: "Anchor Steam"
      },
      {
      text: "What is the best cookie?",
      type: "mc",
      answers: [
      "Chocolate Chip",
      "Sugar",
      "Beer"
      ],
      answer: "Sugar"
      }
      ]
      }
    
    return questions;
  }
}