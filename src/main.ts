import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path'


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: '*',  // or specify the allowed origins
  });

  app.useStaticAssets(process.cwd() + '/public', { prefix: '/public' });
  app.useStaticAssets(process.cwd() + '/images', { prefix: '/images' });

  await app.listen(process.env.PORT || 3500);
}
bootstrap();
