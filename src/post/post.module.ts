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
import { FlashcardRepository } from 'src/flashcard/flashcard.repository';
import { Flashcard } from 'src/flashcard/entity/flashcard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      UserToPost,
      Category,
      Users,
      Comment,
      Flashcard,
    ]),
  ],
  providers: [
    PostService,
    UsersRepository,
    PostRepository,
    FlashcardRepository,
  ],
  controllers: [PostController],
})
export class PostModule {}
