import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { Quiz } from './quiz.entity';

@Injectable()
export class QuizService {
    constructor(private quizRepository:QuizRepository){}


    async getQuiz(subject:string, level:number): Promise<Quiz[]>{
        await this.quizRepository.getQuiz(subject, level)
        return
    }
}
