import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/constants/jwtConstants';
import { LocalStrategy } from './local.strategy';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JwtConstants.secret
    })
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, EncryptionService]
})
export class AuthModule { }
