import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module'
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../configs/typeorm.config';
import { AtGuard } from 'src/users/common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { InMemoryModule } from 'src/in-memory/in-memory.module';
import { QuizModule } from 'src/quiz/quiz.module';


@Module({

  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard
    },],
  imports: [UsersModule,QuizModule, MongooseModule.forRoot('mongodb+srv://Hawook:8785@cluster0.olr8a.mongodb.net/?retryWrites=true&w=majority'),
    TypeOrmModule.forRoot(config), InMemoryModule
  ],
})
export class AppModule { }
