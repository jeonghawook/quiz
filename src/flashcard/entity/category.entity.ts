// src/category/category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Generated,
} from 'typeorm';
import { Flashcard } from './flashcard.entity';
import { Users } from '../../users/entity/users.entity';
import { UsersRepository } from 'src/users/users.repository';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  name: string;

  @ManyToOne(() => Users, (users) => users.categories, {
    onDelete: 'CASCADE', // This ensures that deleting a User deletes all related Categories
  })
  @JoinColumn({ name: 'userId' }) // Explicitly define the FK column if it doesn't follow TypeORM's convention
  users: Users;

  @OneToMany(() => Flashcard, (flashcard) => flashcard.category, {
    cascade: true, // Or specifically ['insert', 'update']
    onDelete: 'CASCADE', // This ensures that deleting a Category deletes all related Flashcards
  })
  flashcards: Flashcard[];

  @Column()
  userId: number;

  @Column()
  @Generated('increment')
  sort: number;
}
