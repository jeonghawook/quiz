import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getAllPosts() {
    return await this.postService.getAllPosts();
  }

  @Get('/:postId')
  async getOnePost(@Param() postId: number) {
    return await this.postService.getOnePost(postId);
  }

  @Post('/:postId/like')
  async updateLike(@Body() postLikeInfoDto: any) {
    return await this.postService.updateLike(postLikeInfoDto);
  }

  @Post('/')
  async createPost(@Body() createPostDto: any) {
    return await this.postService.createPost(createPostDto);
  }

  @Patch('/')
  async updatePost(@Body() updatePostDto: any) {
    return await this.postService.updatePost(updatePostDto);
  }
}
