import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtGuard } from 'src/users/common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
//import { InMemoryModule } from 'src/in-memory/in-memory.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeORMConfig } from '../configs/typeorm.config';
import { HttpLoggerMiddleware } from '../middleware/logger';
import { FlashcardModule } from '../flashcard/flashcard.module';
import { InMemoryModule } from 'src/in-memory/in-memory.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
  imports: [
    UsersModule,
    FlashcardModule,

    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        typeORMConfig(configService),
      inject: [ConfigService],
    }),
    InMemoryModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
