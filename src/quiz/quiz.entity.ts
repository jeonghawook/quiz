// quiz.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quiz {

  @Prop()
  question: string;

  @Prop()
  options: string[];

  @Prop()
  answer: string;

  @Prop()
  js_level: number;
}

export type QuizDocument = Quiz & Document;
export const QuizSchema = SchemaFactory.createForClass(Quiz);
