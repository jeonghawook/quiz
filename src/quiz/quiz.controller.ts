import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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




  
    @Get('/:subject/:level')
    async getQuiz(
        @GetUser() user:Users,
        @Param('subject') subject: QuizSubjects,
        @Param('level', ParseIntPipe) level: number
    ): Promise<Quiz[]> {
        console.log(subject, level)
        
        const getQuiz = await this.quizService.getQuiz(subject, level, user)
        console.log(getQuiz)
        return getQuiz
    }

    @Get('/list/:subject/:level')
    async getQuizList(
        @GetUser() user:Users,
        @Param('subject') subject: QuizSubjects,
        @Param('level', ParseIntPipe) level: number
    ): Promise<Quiz[]> {
        console.log(subject, level)
        
        const getQuizList = await this.quizService.getQuizList(subject, level, user)
        console.log(getQuizList)
        return getQuizList
    }


    @Post('/:subject')
    async createQuiz(
        @GetUser() user: Users,
        @Param('subject') subject: QuizSubjects,
        @Body() createQuizDto: CreateQuizDto
    ): Promise<{message : string}> {
        try {
            const createQuiz = await this.quizService.createQuiz(subject, createQuizDto, user)
            return {message : 'success'}
        } catch (error) {
            console.log(error)
        }
            
    }

    @Delete('/:subject/:level/:quizId')
    async deleteQuiz(
        @GetUser() user:Users,
        @Param('subject') subject: QuizSubjects,
        @Param('level') level : Number,
        @Param('quizId') quizId: string
    ): Promise<any>{
        try {
         await this.quizService.deleteQuiz(subject,level,user,quizId)
        } catch (error) {
            console.log(error)
        }
    }

}
