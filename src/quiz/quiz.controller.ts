import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { GetUser } from 'src/users/common/decorators';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.entity';
import { Users } from 'src/users/users.entity';
import { CreateQuizDto } from './dtos/quiz-dtos';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) { }



    @Get('/:subject/:level')
    async getQuiz(
        @Param('subject') subject: string,
        @Param('level', ParseIntPipe) level: number
    ): Promise<Quiz[]> {
        const getQuiz = await this.quizService.getQuiz(subject, level)
        return
    }

    @Post('/:subject')
    async createQuiz(
        @GetUser() user: Users,
        @Param('subject') subject: string,
        @Body() createQuizDto: CreateQuizDto
    ): Promise<string> {
        //const createQuiz = await this.quizService.createQuiz(subject, createQuizDto, user)
        return
    }

}
