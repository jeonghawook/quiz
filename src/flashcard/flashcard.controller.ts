import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser, Public } from 'src/users/common/decorators';
import { FlashcardService } from './flashcard.service';
import { Flashcard } from './entity/flashcard.entity';
import { CreateFlashcardDto, UpdateFlashcardDto } from './dtos/flashcard-dtos';
import { Users } from 'src/users/entity/users.entity';
import { AtGuard } from 'src/users/common/guards/at.guard';

@Controller('category')
export class FlashcardController {
  constructor(private flashcardService: FlashcardService) {}

  @UseGuards(AtGuard)
  @Get()
  async getCategory(@GetUser() users: Users) {
    try {
      return await this.flashcardService.getCategory(users);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDto: any,
    @GetUser() users: Users,
  ) {
    try {
      return await this.flashcardService.createCategory(
        users,
        createCategoryDto,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AtGuard)
  @Patch()
  async updateCategory(@GetUser() users: Users, @Body() updateCategory: any) {
    try {
      return await this.flashcardService.updateCategory(users, updateCategory);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async deleteCategory(@GetUser() users, @Body() categoryIds) {
    try {
      await this.flashcardService.deleteCategory(users, categoryIds);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:categoryId/flashcard')
  async getFlashcard(
    @GetUser() users: Users,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Flashcard[]> {
    try {
      return await this.flashcardService.getFlashcard(categoryId, users);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:categoryId/flashcard/list')
  async getFlashcardList(
    @GetUser() user: Users,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Flashcard[]> {
    try {
      return await this.flashcardService.getFlashcardList(categoryId, user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/:categoryId/flashcard')
  async createFlashcard(
    @GetUser() user: Users,
    @Body() createFlashcardDto: CreateFlashcardDto,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<{ message: string }> {
    try {
      await this.flashcardService.createFlashcard(
        categoryId,
        createFlashcardDto,
        user,
      );
      return { message: 'success' };
    } catch (error) {
      throw new BadRequestException('failed to created flashcard');
    }
  }

  @UseGuards(AtGuard)
  @Patch('/flashcard')
  async updateFlashcard(
    @GetUser() user: Users,
    @Body() UpdateFlashcardDto: UpdateFlashcardDto,
  ): Promise<{ message: string }> {
    try {
      await this.flashcardService.updateFlashcard(user, UpdateFlashcardDto);
      return { message: 'success' };
    } catch (error) {
      throw error;
    }
  }

  @Delete('/flashcard')
  async deleteFlashcard(
    @GetUser() user: Users,
    @Body() flashcardIds,
  ): Promise<void> {
    try {
      await this.flashcardService.deleteFlashcard(user, flashcardIds);
    } catch (error) {
      throw new BadRequestException('cannot delete flashcards');
    }
  }

  @UseGuards(AtGuard)
  @Get('/availableCategory')
  async incrementAvailableCategory(@GetUser() user: Users) {
    try {
      return await this.flashcardService.incrementAvailableCategory(user);
    } catch (error) {
      throw error;
    }
  }
}
