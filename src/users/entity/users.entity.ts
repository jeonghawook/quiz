import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Category } from '../../flashcard/entity/category.entity';
import { Time } from 'src/time/entities/time.entity';
import { UserToPost } from 'src/post/entity/user-post.entity';
import { Post } from 'src/post/entity/post.entity';

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

  @Column({ default: false })
  emailVerificationStatus: boolean;

  @OneToMany(() => Category, (category) => category.users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  categories: Category[];

  @OneToMany(() => Time, (time) => time.users)
  time: Time[];

  @Column({ default: 0 })
  totalTime: number;

  @OneToMany(() => UserToPost, (userToPost) => userToPost.post)
  userToPost: UserToPost[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];
}
