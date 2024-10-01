import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationEntity } from './application.entity';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplicationEntity, UserEntity])
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService]
})
export class ApplicationModule { }
