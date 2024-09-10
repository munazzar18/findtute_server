import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsEntity } from './subjects.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { GradeEntity } from 'src/grade/grade.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    TypeOrmModule.forFeature([SubjectsEntity, UserEntity, GradeEntity])
  ],
  exports: [SubjectsService],
  controllers: [SubjectsController],
  providers: [SubjectsService, UserService, EncryptionService]
})
export class SubjectsModule { }
