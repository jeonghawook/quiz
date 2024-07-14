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

  @UseGuards(AtGuard)
  @Get('validate/:categoryId')
  async validatePostExistence(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    try {
      return await this.postService.validatePostExistence(categoryId);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Get('/')
  async getAllPosts(@GetUser() user: Users) {
    try {
      return await this.postService.getAllPosts(user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Get('/details/:postId')
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
  @Get('/like/:postId')
  async updateLike(
    @Param('postId', ParseIntPipe) postId: number,
    @GetUser() user: Users,
  ) {
    try {
      return await this.postService.updateLike(postId, user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Post('/purchase')
  async purchaseFlashcardPost(
    @GetUser() user: Users,
    @Body() purchaseInfo: any,
  ) {
    try {
      return await this.postService.purchaseFlashcardPost(purchaseInfo, user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Post('/:postId/comment')
  async createComment(
    @GetUser() user: Users,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() commentDto: any,
  ) {
    try {
      return await this.postService.createComment(postId, commentDto, user);
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

  @UseGuards(AtGuard)
  @Post('/')
  async createPost(@GetUser() user: Users, @Body() createPostDto: any) {
    try {
      return await this.postService.createPost(createPostDto, user);
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
