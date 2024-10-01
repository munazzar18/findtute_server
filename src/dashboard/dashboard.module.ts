import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { GradeEntity } from 'src/grade/grade.entity';
import { SubjectsEntity } from 'src/subjects/subjects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, GradeEntity, SubjectsEntity]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
