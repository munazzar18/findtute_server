import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from './encryption/encryption.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants/jwtConstants';
import { ProfileModule } from './profile/profile.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASS
        }
      }
    }),
    JwtModule.register({
      secret: JwtConstants.secret
    }),
    AuthModule,
    UserModule,
    EncryptionModule,
    ProfileModule,
    CoursesModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
