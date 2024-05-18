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
  getCategory(@GetUser() users: Users) {
    return this.flashcardService.getCategory(users);
  }

  @UseGuards(AtGuard)
  @Post()
  createCategory(@Body() createCategoryDto: any, @GetUser() users: Users) {
    return this.flashcardService.createCategory(users, createCategoryDto);
  }

  @UseGuards(AtGuard)
  @Patch()
  updateCategory(@GetUser() users: Users, @Body() updateCategory: any) {
    return this.flashcardService.updateCategory(users, updateCategory);
  }

  @Delete()
  deleteCategory(@GetUser() users, @Body() categoryIds) {
    this.flashcardService.deleteCategory(users, categoryIds);
  }

  @Get('/:categoryId/flashcard')
  async getFlashcard(
    @GetUser() users: Users,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Flashcard[]> {
    const getFlashcard = await this.flashcardService.getFlashcard(
      categoryId,
      users,
    );

    return getFlashcard;
  }

  @Get('/:categoryId/flashcard/list')
  async getFlashcardList(
    @GetUser() user: Users,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Flashcard[]> {
    return await this.flashcardService.getFlashcardList(categoryId, user);
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
    this.flashcardService.updateFlashcard(user, UpdateFlashcardDto);
    return { message: 'success' };
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
}
