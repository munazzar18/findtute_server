import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GradeEntity, SubjectsEntity]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    UserModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
