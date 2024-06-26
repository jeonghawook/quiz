import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { IsBoolean, IsString } from 'class-validator';

@Entity()
export class Flashcard {
  @PrimaryGeneratedColumn()
  flashcardId: number;

  @ManyToOne(() => Category, (category) => category.flashcards, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @Column()
  question: string;

  @IsString()
  @Column()
  answer: string;

  @IsBoolean()
  @Column({
    default: false,
  })
  focus: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
