import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from '../configs/typeorm.config';
import { HttpLoggerMiddleware } from '../middleware/logger';
import { FlashcardModule } from '../flashcard/flashcard.module';
import { InMemoryModule } from 'src/in-memory/in-memory.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        typeORMConfig(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    FlashcardModule,
    EmailModule,
    InMemoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
