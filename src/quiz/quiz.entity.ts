// src/quiz/models/quiz.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema()
export class Quiz {

    @Prop({ required: true })
    _id: number;

    @Prop()
    question: string;

    @Prop()
    options: string[];

    @Prop()
    answer: string;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
