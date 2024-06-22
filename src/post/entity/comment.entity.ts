import { Post } from 'src/post/entity/post.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @Column()
  userId: number;

  @Column()
  nickname: string;

  @Column()
  postId: number;

  @Column({ default: 0 })
  likes: number;

  @ManyToOne(() => Post, (post) => post.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: Post;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
