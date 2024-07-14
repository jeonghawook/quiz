import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { DataSource, Like, Not, Repository } from 'typeorm';
import { Category } from 'src/flashcard/entity/category.entity';
import { Users } from 'src/users/entity/users.entity';
import { UserToPost } from './entity/user-post.entity';
import { Time } from 'src/time/entities/time.entity';
import { Comment } from './entity/comment.entity';
import { Flashcard } from 'src/flashcard/entity/flashcard.entity';
import { link } from 'fs';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(UserToPost)
    private readonly userToPostRepository: Repository<UserToPost>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  async puchaseValidation(postId: number, userId: number) {
    return await this.userToPostRepository.findOneBy({
      postId,
      userId,
    });
  }

  async getPostInfo(postId: any) {
    return await this.postRepository.findOneBy({ postId });
  }

  async myPostValidation(categoryId: number, userId: number) {
    return await this.categoryRepository.findOneBy({
      categoryId,
      userId,
    });
  }

  async getAllPosts() {
    return await this.postRepository.find({
      relations: ['userToPost'],
    });
  }

  async getFlashcardofPost(postId: number) {
    return await this.postRepository.findOne({
      where: { postId },
      relations: ['category', 'category.flashcards'],
    });
  }

  async updateLike(postId: number, postLike: any) {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        if (!postLike.like) {
          await transactionalEntityManager.increment(
            Post,
            { postId },
            'like',
            1,
          );

          return await transactionalEntityManager.update(
            UserToPost,
            { postId: postId },
            { like: true },
          );
        } else {
          await transactionalEntityManager.decrement(
            Post,
            { postId },
            'like',
            1,
          );

          return await transactionalEntityManager.update(
            UserToPost,
            { postId: postId },
            { like: false },
          );
        }
      },
    );
  }

  async createPost(createPostDto: any) {
    try {
      const newPost = this.postRepository.create(createPostDto);
      return await this.postRepository.save(newPost);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 커뮤니티에 존재하는 제목입니다');
      }
    }
  }

  async updatePost(updatePostDto: any) {
    const { postId, ...updatedPostInfo } = updatePostDto;
    return await this.postRepository.update(
      {
        postId: updatePostDto.postId,
      },
      updatedPostInfo,
    );
  }

  async getPostWithComment(postId: number) {
    return await this.postRepository.findOne({
      where: { postId },
      relations: ['comment'],
    });
  }

  async validatePostExistence(categoryId: number) {
    return await this.postRepository.findOneBy({
      categoryId,
    });
  }

  async purchaseFlashcardPostAndDecrementUserTime(
    purchaseInfo: any,
    postInfo: Post,
    user: Users,
    flashcardInfo: any,
  ) {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.decrement(
        Users,
        { userId: user.userId },
        'totalTime',
        postInfo.pointsRequired,
      );

      await transactionalEntityManager.increment(
        Users,
        { userId: user.userId },
        'availableCategory',
        1,
      );

      const userToPost = new UserToPost();
      userToPost.postId = postInfo.postId;
      userToPost.userId = user.userId;
      await transactionalEntityManager.save(userToPost);

      const time = new Time();
      time.timeUsed = postInfo.pointsRequired;
      time.userId = user.userId;
      time.timeTransactionInfo = purchaseInfo.transactionDetails;
      await transactionalEntityManager.save(time);

      const category = new Category();
      category.name = postInfo.title;
      category.userId = user.userId;
      category.hasOwner = true;

      const savedCategory = await transactionalEntityManager.save(category);

      const flashcard = new Flashcard();
      const allFlashcard = flashcardInfo.map((data) => {
        flashcard.categoryId = savedCategory.categoryId;
        flashcard.question = data.question;
        flashcard.answer = data.answer;
        return flashcard;
      });

      await transactionalEntityManager.save(allFlashcard);
    });
  }

  async createComment(commentDto: any) {
    const commentInfo = this.commentRepository.create(commentDto);
    await this.commentRepository.save(commentInfo);
  }

  async validateLike(postId: number, user: Users) {
    return await this.userToPostRepository.findOne({
      select: { like: true },
      where: { postId, userId: user.userId },
    });
  }
}
