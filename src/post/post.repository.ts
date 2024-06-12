import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async getAllPosts() {
    return await this.postRepository.find();
  }

  async getOnePost(postId: number) {
    return await this.postRepository.findOneBy({ postId });
  }

  async updateLike(postLikeInfoDto: any) {
    if (postLikeInfoDto.like) {
      await this.postRepository.increment(
        { postId: postLikeInfoDto.postId },
        'likes',
        1,
      );
    } else {
      await this.postRepository.decrement(
        { postId: postLikeInfoDto.postId },
        'likes',
        1,
      );
    }
  }
  async createPost(createPostDto: any) {
    const newPost = this.postRepository.create(createPostDto);
    return await this.postRepository.save(newPost);
  }

  async updatePost(updatePostDto: any) {
    const { postId, ...updatedPostInfo } = updatePostDto;
    return await this.postRepository.update(
      {
        postId: updatePostDto.postId,
      },
      updatedPostInfo,
    );
  }
}
