import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { PostRepository } from './post.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],

  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
