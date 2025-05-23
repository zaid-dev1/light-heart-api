import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'http';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payload to DTO instances
      whitelist: true, // Strip properties not included in the DTO
    }),
  );

  await app.listen(3001);

  const server: Server = app.getHttpServer();

  server.timeout = 0;
  server.keepAliveTimeout = 0;

}
bootstrap();
