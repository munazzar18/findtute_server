import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { EncryptionService } from 'src/encryption/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: JwtConstants.secret
    })
  ],
  controllers: [UserController],
  providers: [UserService, EncryptionService],
  exports: [UserService]
})
export class UserModule { }
