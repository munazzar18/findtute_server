import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { Course } from './course.entity';
import { UserService } from 'src/user/user.service';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, UserEntity]),
    JwtModule.register({
      secret: JwtConstants.secret
    }),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, UserService, EncryptionService],
})
export class CoursesModule { }
