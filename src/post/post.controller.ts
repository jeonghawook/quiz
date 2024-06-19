import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AtGuard } from 'src/users/common/guards/at.guard';
import { Users } from 'src/users/entity/users.entity';
import { GetUser } from 'src/users/common/decorators';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  async getAllPosts() {
    try {
      return await this.postService.getAllPosts();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Get('/:postId/comment')
  async getPostWithComment(
    @GetUser() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    try {
      return await this.postService.getPostWithComment(postId, user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Get('/:categoryId/:postId')
  async validateUserPost(
    @GetUser() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    try {
      return await this.postService.validateUserPost(categoryId, postId, user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Get('/:postId')
  async getFlashcardofPost(
    @GetUser() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    try {
      return await this.postService.getFlashcardofPost(postId, user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/:postId/like')
  async updateLike(@Body() postLikeInfoDto: any) {
    try {
      return await this.postService.updateLike(postLikeInfoDto);
    } catch (error) {
      throw error;
    }
  }

  @Post('/')
  async createPost(@Body() createPostDto: any) {
    try {
      return await this.postService.createPost(createPostDto);
    } catch (error) {
      throw error;
    }
  }

  @Patch('/')
  async updatePost(@Body() updatePostDto: any) {
    try {
      return await this.postService.updatePost(updatePostDto);
    } catch (error) {
      throw error;
    }
  }
}
