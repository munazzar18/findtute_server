import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { ApplicationModule } from 'src/application/application.module';
import { UserModule } from 'src/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { ApplicationEntity } from 'src/application/application.entity';


@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    TypeOrmModule.forFeature([PaymentEntity, ApplicationEntity]),
    ApplicationModule,
    UserModule,
    HttpModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EncryptionService, {
    provide: 'SWITCH_URL',
    useValue: process.env.SWITCH_URL
  }, {
      provide: 'SWITCH_BASE_URL',
      useValue: process.env.SWITCH_BASE_URL
    }]
})
export class PaymentModule { }
