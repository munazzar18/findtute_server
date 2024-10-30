import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { UserEntity } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { ChatModule } from 'src/chat/chat.module';


@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    TypeOrmModule.forFeature([ApplicationEntity, UserEntity]),
    ChatModule
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService]
})
export class ApplicationModule { }
