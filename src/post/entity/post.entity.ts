import { Category } from 'src/flashcard/entity/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  pointsRequired: number;

  @Column({ default: 0 })
  likes: number;

  @OneToOne(() => Category, (category) => category.post)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;
}
