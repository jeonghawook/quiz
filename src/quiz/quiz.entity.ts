import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Quiz {

  @Prop()
  question: string;

  @Prop({ type: Number, enum: [0, 1, 2] })
  options: number;

  @Prop()
  answer: string;

  @Prop()
  level: number;
}

export type QuizDocument = Quiz & Document;
export const QuizSchema = SchemaFactory.createForClass(Quiz);
