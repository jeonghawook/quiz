import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionFilter } from './exceptions/badrequestException.filter';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorizedException.filter';
import { NotFoundExceptionFilter } from './exceptions/notfoundException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new UnauthorizedExceptionFilter(),
    new NotFoundExceptionFilter(),
  );

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
