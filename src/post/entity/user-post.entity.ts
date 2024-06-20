import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from './post.entity';

@Entity()
@Unique(['userId', 'postId'])
export class UserToPost {
  @PrimaryGeneratedColumn()
  userToPostId: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @ManyToOne(() => Users, (users) => users.userToPost, {
    cascade: true, // Or specifically ['insert', 'update']
    onDelete: 'CASCADE', // This ensures that deleting a Category deletes all related Flashcards
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Post, (post) => post.userToPost, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
