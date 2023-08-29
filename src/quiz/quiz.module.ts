import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';

@Module({
  imports:[  MongooseModule.forFeature([
      { name: 'javascripts', schema: QuizSchema }, // Assuming you have 'javascript' as the collection name for that model
      { name: 'nodejs', schema: QuizSchema },
      { name: 'personels', schema: QuizSchema },
      
    ]), TypeOrmModule.forFeature([Users])],
  controllers: [QuizController],
  providers: [QuizService,QuizRepository]
})
export class QuizModule {}
