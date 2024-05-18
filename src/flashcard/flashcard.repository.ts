import mongoose, { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Flashcard } from './entity/flashcard.entity';
import { Users } from '../users/entity/users.entity';
import { CreateFlashcardDto } from './dtos/flashcard-dtos';
import { Category } from './entity/category.entity';
import { UpdateCategoryDto } from './dtos/category-dtos';

@Injectable()
export class FlashcardRepository {
  constructor(
    @InjectRepository(Flashcard)
    private flashcardRepository: Repository<Flashcard>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getCategory(users) {
    return this.categoryRepository.find({
      where: {
        users: { userId: users.userId },
      },
      select: ['categoryId', 'name'],
    });
  }
  createCategory(users, createCategoryDto) {
    return this.categoryRepository.save({
      name: createCategoryDto.name,
      users: { userId: users.userId },
    });
  }
  updateCategory(users, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(updateCategoryDto.categoryId, {
      name: updateCategoryDto.name,
    });
  }

  deleteCategory(categoryIds: any) {
    return this.categoryRepository.delete({
      categoryId: In(categoryIds.categoryIds),
    });
  }

  getFlashcard(categoryId: number) {
    return this.flashcardRepository
      .createQueryBuilder('flashcard')
      .where('flashcard.categoryId = :categoryId', { categoryId })
      .getMany();
  }

  getFlashcardList(categoryId: number, user: Users) {
    return this.flashcardRepository
      .createQueryBuilder('flashcard')
      .select('flashcard.question')
      .addSelect('flashcard.flashcardId')
      .addSelect('flashcard.answer')
      .where('flashcard.categoryId = :categoryId', { categoryId })
      .getMany();
  }

  createFlashcard(categoryId: number, createFlashcardDto: CreateFlashcardDto) {
    return this.flashcardRepository.save({
      category: { categoryId },
      question: createFlashcardDto.question,
      answer: createFlashcardDto.answer,
    });
  }

  updateFlashcard(updateFlashcardDto) {
    const { flashcardId, question, answer } = updateFlashcardDto;

    return this.flashcardRepository.update(flashcardId, {
      question: question,
      answer: answer,
    });
  }

  deleteFlashcard(flashcardIds: any) {
    return this.flashcardRepository.delete({
      flashcardId: In(flashcardIds.flashcardIds),
    });
  }
}
