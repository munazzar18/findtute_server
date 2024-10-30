import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EncryptionModule } from './encryption/encryption.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './constants/jwtConstants';
import { AppController } from './app.controller';
import { GradeModule } from './grade/grade.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubjectsModule } from './subjects/subjects.module';
import { MulterModule } from '@nestjs/platform-express';
import { dataSourceOptions } from 'data-source';
import { ApplicationModule } from './application/application.module';
import { CountryStateCityModule } from './country-state-city/country-state-city.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        secure: true,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASS
        }
      },
      // defaults: {
      //   from: '"No Reply" <noreply@findtute.com>',
      //   replyTo: 'noreply@findtute.com',
      // },
    }),
    MulterModule.register({
      dest: './public/uploads/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: JwtConstants.secret,
      }),
    }),
    AuthModule,
    UserModule,
    EncryptionModule,
    GradeModule,
    SubjectsModule,
    ApplicationModule,
    CountryStateCityModule,
    DashboardModule,
    PaymentModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [],
})

export class AppModule { }



