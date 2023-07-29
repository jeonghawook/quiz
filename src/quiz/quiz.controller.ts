import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetUser } from 'src/users/common/decorators';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.entity';

@Controller('quiz')
export class QuizController {
constructor(private quizService : QuizService){}



@Get('/:subject/:level')
async getQuiz(
    @Param('subject') subject:string,
    @Param('level', ParseIntPipe) level: number
):Promise<Quiz[]>{
    const getQuiz= await this.quizService.getQuiz(subject, level)
    return
}

}
