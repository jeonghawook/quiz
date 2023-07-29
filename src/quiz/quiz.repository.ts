import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel('javascript') private javascriptModel: Model<QuizDocument>,
    @InjectModel('nodejs') private nodejsModel: Model<QuizDocument>,
    @InjectModel('personel') private personelModel: Model<QuizDocument>,
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
      case 'personel':
        modelToUse = this.personelModel;
        break;
      default:
        throw new Error('Invalid subject.');
    }
    return modelToUse;
  }

  async getQuiz(subject: string, level: number): Promise<Quiz[]> {
    const modelToUse = this.getModel(subject);
    const quizzes = await modelToUse.find({ js_level: level }).exec();
    return quizzes;
  }
}
