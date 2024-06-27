import { Module } from '@nestjs/common';
import { FlashcardController } from './flashcard.controller';
import { FlashcardService } from './flashcard.service';
import { FlashcardRepository } from './flashcard.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/users.entity';
import { Flashcard } from './entity/flashcard.entity';
import { Category } from './entity/category.entity';
import { UsersRepository } from 'src/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Flashcard, Category])],
  controllers: [FlashcardController],
  providers: [FlashcardService, FlashcardRepository, UsersRepository],
})
export class FlashcardModule {}
