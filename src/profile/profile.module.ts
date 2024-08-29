import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { GradeEntity } from 'src/grade/grade.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity, UserEntity, GradeEntity]),
    JwtModule.register({
      secret: JwtConstants.secret
    })
  ],
  controllers: [ProfileController],
  providers: [ProfileService, UserService, EncryptionService]
})
export class ProfileModule { }
