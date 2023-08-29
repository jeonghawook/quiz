import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dtos/quiz-dtos';
import { Users } from 'src/users/users.entity';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel('javascripts') private javascriptModel: Model<QuizDocument>,
    @InjectModel('nodejs') private nodejsModel: Model<QuizDocument>,
    @InjectModel('personels') private personelModel: Model<QuizDocument>,
  ) {}

  getModel(subject: string): Model<QuizDocument> {
    let modelToUse: Model<QuizDocument>;
    switch (subject) {
      case 'javascript':
        modelToUse = this.javascriptModel;
        break;
      case 'nodejs':
        modelToUse = this.nodejsModel;
        break;
      case 'personnel':
        modelToUse = this.personelModel;
        break;
      default:
        throw new Error('Invalid subject.');
    }
    return modelToUse;
  }

  async getQuiz(subject: string, level: number, user: Users): Promise<Quiz[]> {
    const modelToUse = this.getModel(subject);

    const query = (subject === "personnel")
    ? { level, userId: user.userId }
    : { level };
  
  const quizzes = await modelToUse.find(query).exec();
  return quizzes;

  }

  async createQuiz(subject:string, createQuizDto: CreateQuizDto, user:Users): Promise<void>{
    const modelToUse = this.getModel(subject);
    createQuizDto.userId = user.userId;
    await modelToUse.create(createQuizDto)
  }
}
