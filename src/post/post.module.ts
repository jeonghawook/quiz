import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostRepository } from './post.repository';
import { UserToPost } from './entity/user-post.entity';
import { Category } from 'src/flashcard/entity/category.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Users } from 'src/users/entity/users.entity';
import { Comment } from './entity/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, UserToPost, Category, Users, Comment]),
  ],
  providers: [PostService, UsersRepository, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
