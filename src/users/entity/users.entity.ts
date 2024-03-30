import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Category } from '../../flashcard/entity/category.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  @Unique(['nickname'])
  nickname: string;

  @IsNotEmpty()
  @Column()
  userName: string;

  @Column()
  @Unique(['userEmail'])
  userEmail: string;

  @Column()
  password: string;

  @IsOptional()
  @Column({ nullable: true })
  refreshToken: string;

  @IsBoolean()
  @Column({ default: false })
  isActive: boolean;

  @Column({ default: 0 })
  rank: number;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Category, (category) => category.users, {
    cascade: true, // Or specifically ['insert', 'update']
    onDelete: 'CASCADE', // Optional based on whether you want deleting a User to delete all their Categories
  })
  categories: Category[];
}
