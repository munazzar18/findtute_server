// chat.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './chat.entity';
import { MessageEntity } from './message.entity';
import { RoomEntity } from './room.entity';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ApplicationEntity } from 'src/application/application.entity';
import { UserEntity } from 'src/user/user.entity';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    TypeOrmModule.forFeature([ChatEntity, MessageEntity, RoomEntity, ApplicationEntity, UserEntity]),
    UserModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService]
})
export class ChatModule { }
