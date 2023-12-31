import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { Quiz } from './quiz.entity';
import { CreateQuizDto, UpdateQuizDto } from './dtos/quiz-dtos';
import { Users } from 'src/users/users.entity';
import { QuizSubjects } from './enums/quiz-enums';

@Injectable()
export class QuizService {
  constructor(private quizRepository: QuizRepository) {}

  async getQuiz(
    subject: QuizSubjects,
    level: number,
    user: Users,
  ): Promise<Quiz[]> {
    return await this.quizRepository.getQuiz(subject, level, user);
  }


  async getQuizList(
    subject: QuizSubjects,
    level: number,
    user: Users,
  ): Promise<Quiz[]> {
    return await this.quizRepository.getQuizList(subject, level, user);
  }

  async createQuiz(
    subject: QuizSubjects,
    createQuizDto: CreateQuizDto,
    user: Users,
  ): Promise<string> {
    await this.quizRepository.createQuiz(subject, createQuizDto, user);
    return;
  }

  async deleteQuiz(
    subject: QuizSubjects,
    level: Number,
    user: Users,
    quizId: string,
  ): Promise<string> {
    await this.quizRepository.deleteQuiz(subject, level, user, quizId);
    return;
  }


  async updateQuiz(
    subject: QuizSubjects,
    level: Number,
    user: Users,
    quizId: string,
    updateQuizDto: UpdateQuizDto
  ): Promise<string> {
    await this.quizRepository.updateQuiz(subject, level, user, quizId, updateQuizDto);
    return;
  }
}
