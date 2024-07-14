// src/category/category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Generated,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { Users } from '../../users/entity/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Post } from 'src/post/entity/post.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  name: string;

  @Column({ default: false })
  hasOwner: boolean;

  @ManyToOne(() => Users, (users) => users.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  users: Users;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.category)
  flashcards: Flashcard[];

  @Column()
  userId: number;

  @Column()
  @Generated('increment')
  sort: number;

  @OneToOne(() => Post, (post) => post.category)
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
