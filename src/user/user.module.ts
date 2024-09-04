import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { EncryptionService } from 'src/encryption/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GradeEntity, SubjectsEntity]),
    JwtModule.register({
      secret: JwtConstants.secret
    })
  ],
  controllers: [UserController],
  providers: [UserService, EncryptionService],
  exports: [UserService]
})
export class UserModule { }
