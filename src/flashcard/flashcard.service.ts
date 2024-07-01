import { BadRequestException, Injectable } from '@nestjs/common';
import { FlashcardRepository } from './flashcard.repository';
import { CreateFlashcardDto, UpdateFlashcardDto } from './dtos/flashcard-dtos';
import { Users } from 'src/users/entity/users.entity';
import { Flashcard } from './entity/flashcard.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class FlashcardService {
  constructor(
    private flashcardRepository: FlashcardRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async getCategory(users) {
    return await this.flashcardRepository.getCategory(users);
  }

  async createCategory(users, createCategoryDto) {
    const category = await this.flashcardRepository.getCategory(users);
    if (category.find((data) => createCategoryDto.name === data.name)) {
      throw new BadRequestException('이미 있는 카테고리 입니다');
    }

    const user = await this.userRepository.findUserWithinServer(users);

    if (category.length >= user.availableCategory) {
      throw new BadRequestException(
        `${user.availableCategory} 이상 카테고리는 만들수 없습니다`,
      );
    }

    return await this.flashcardRepository.createCategory(
      users,
      createCategoryDto,
    );
  }

  async updateCategory(users, updateCategory) {
    const category = await this.flashcardRepository.getCategory(users);

    if (category.find((data) => updateCategory.name === data.name)) {
      throw new BadRequestException('이미 있는 카테고리 입니다');
    }
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

  async incrementAvailableCategory(user: Users) {
    const userInfo = await this.userRepository.findUserWithinServer(user);
    if (userInfo.totalTime < 10) {
      throw new BadRequestException(
        '시간이 부족합니다 "커뮤니티"에서 시간을 모아주세요',
      );
    }
    return await this.flashcardRepository.incrementAvailableCategory(user);
  }
}
