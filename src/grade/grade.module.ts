import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { GradeService } from './grade.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeEntity } from './grade.entity';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/user.entity';
import { EncryptionService } from 'src/encryption/encryption.service';
import { SubjectsEntity } from 'src/subjects/subjects.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    TypeOrmModule.forFeature([GradeEntity, UserEntity, SubjectsEntity])
  ],
  exports: [GradeService],
  controllers: [GradeController],
  providers: [GradeService, UserService, EncryptionService]
})
export class GradeModule { }
