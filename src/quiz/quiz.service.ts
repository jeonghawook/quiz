import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { Quiz } from './quiz.entity';
import { CreateQuizDto } from './dtos/quiz-dtos';
import { Users } from 'src/users/users.entity';

@Injectable()
export class QuizService {
    constructor(private quizRepository:QuizRepository){}


    async getQuiz(subject:string, level:number, user:Users): Promise<Quiz[]>{
      
        return await this.quizRepository.getQuiz(subject, level, user)
    }

    async createQuiz(subject:string,createQuizDto:CreateQuizDto,user:Users):Promise<string>{
        await this.quizRepository.createQuiz(subject,createQuizDto,user)
        return
    }
}
