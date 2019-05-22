import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';
;

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://carlos:carlos1533@cluster0-y7wrm.mongodb.net/test?retryWrites=true', { useNewUrlParser: true }),
    ProfileModule,
    SharedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
