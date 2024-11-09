import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { EncryptionService } from 'src/encryption/encryption.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { ApplicationModule } from 'src/application/application.module';
import { UserModule } from 'src/user/user.module';
import { HttpModule, HttpService } from '@nestjs/axios';


@Module({
  imports: [
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    ApplicationModule,
    UserModule,
    HttpModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, EncryptionService]
})
export class PaymentModule { }
