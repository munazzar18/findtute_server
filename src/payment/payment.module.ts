import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService, EncryptionService]
})
export class PaymentModule { }
