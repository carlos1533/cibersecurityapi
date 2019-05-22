import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { UsersModule } from '../profile/users/users.module';
import { PassportModule } from '@nestjs/passport';



@Global()
@Module({
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [AuthService, PassportModule],
  imports: [UsersModule, PassportModule],
})
export class SharedModule { }