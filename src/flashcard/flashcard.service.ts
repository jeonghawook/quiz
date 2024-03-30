import { BadRequestException, Injectable } from '@nestjs/common';
import { FlashcardRepository } from './flashcard.repository';
import { CreateFlashcardDto, UpdateFlashcardDto } from './dtos/flashcard-dtos';
import { Users } from 'src/users/entity/users.entity';
import { Flashcard } from './entity/flashcard.entity';

@Injectable()
export class FlashcardService {
  constructor(private flashcardRepository: FlashcardRepository) {}

  async getCategory(users) {
    return await this.flashcardRepository.getCategory(users);
  }
  async createCategory(users, createCategoryDto) {
    const category = await this.flashcardRepository.getCategory(users);
    if (category.find((data) => createCategoryDto.name === data.name)) {
      throw new BadRequestException('이미 있는 카테고리 입니다');
    }
    if (category.length >= 7)
      throw new BadRequestException('7개 이상 카테고리는 만들수 없습니다');

    return await this.flashcardRepository.createCategory(
      users,
      createCategoryDto,
    );
  }

  async updateCategory(users, updateCategory) {
    return await this.flashcardRepository.updateCategory(users, updateCategory);
  }
  async deleteCategory(users, categoryIds) {
    return await this.flashcardRepository.deleteCategory(categoryIds);
  }

  async getFlashcard(categoryId: number, user: Users): Promise<Flashcard[]> {
    return await this.flashcardRepository.getFlashcard(categoryId);
  }

  async getFlashcardList(
    categoryId: number,
    user: Users,
  ): Promise<Flashcard[]> {
    return await this.flashcardRepository.getFlashcardList(categoryId, user);
  }

  async createFlashcard(
    categoryId: number,
    createFlashcardDto: CreateFlashcardDto,
    user: Users,
  ): Promise<string> {
    await this.flashcardRepository.createFlashcard(
      categoryId,
      createFlashcardDto,
    );
    return 'create Successful';
  }

  async updateFlashcard(
    user: Users,
    updateFlashcardDto: UpdateFlashcardDto,
  ): Promise<string> {
    await this.flashcardRepository.updateFlashcard(updateFlashcardDto);
    return 'update SuccessFul';
  }

  async deleteFlashcard(user, flashcardIds): Promise<string> {
    await this.flashcardRepository.deleteFlashcard(flashcardIds);
    return;
  }
}
