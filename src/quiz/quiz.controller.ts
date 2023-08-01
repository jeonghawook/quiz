import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { GetUser, Public } from 'src/users/common/decorators';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.entity';
import { Users } from 'src/users/users.entity';
import { CreateQuizDto } from './dtos/quiz-dtos';
import { QuizValidationPipe } from './pipes/quiz-enums';
import { QuizSubjects } from './enums/quiz-enums';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) { }




    @Public()
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
        @Param('subject') subject: QuizSubjects,
        @Body() createQuizDto: CreateQuizDto
    ): Promise<{message : string}> {
        const createQuiz = await this.quizService.createQuiz(subject, createQuizDto, user)
        return {message : 'success'}
    }

}
