import { Category } from 'src/flashcard/entity/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserToPost } from './user-post.entity';
import { Comment } from 'src/post/entity/comment.entity';
import { Users } from 'src/users/entity/users.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  pointsRequired: number;

  @Column({ default: 0 })
  likes: number;

  @OneToOne(() => Category, (category) => category.post)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => UserToPost, (userToPost) => userToPost.post)
  userToPost: UserToPost[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Users, (user) => user.post)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  userId: number;
}
