import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async getAllPosts() {
    return await this.postRepository.getAllPosts();
  }

  async getOnePost(postId: number) {
    return await this.postRepository.getOnePost(postId);
  }

  async updateLike(postLikeInfoDto: any) {
    return await this.postRepository.updateLike(postLikeInfoDto);
  }

  async createPost(createPostDto: any) {
    return await this.postRepository.createPost(createPostDto);
  }

  async updatePost(updatePostDto: any) {
    return await this.postRepository.updatePost(updatePostDto);
  }
}
