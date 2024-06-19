import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { Repository } from 'typeorm';
import { UserToPost } from './entity/user-post.entity';
import { Category } from 'src/flashcard/entity/category.entity';

@Injectable()
export class PostRepository {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(UserToPost)
    private readonly userToPostRepository: Repository<UserToPost>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async puchaseValidation(postId: number, userId: number) {
    return await this.userToPostRepository.findOneBy({
      postId,
      userId,
    });
  }
  async myPostValidation(categoryId: number, userId: number) {
    return await this.categoryRepository.findOneBy({
      categoryId,
      userId,
    });
  }

  async getAllPosts() {
    return await this.postRepository.find();
  }

  async getFlashcardofPost(postId: number) {
    return await this.postRepository.findOne({
      where: { postId },
      relations: ['category', 'category.flashcards'],
    });
  }

  async updateLike(postLikeInfoDto: any) {
    if (postLikeInfoDto.like) {
      await this.postRepository.increment(
        { postId: postLikeInfoDto.postId },
        'likes',
        1,
      );
    } else {
      await this.postRepository.decrement(
        { postId: postLikeInfoDto.postId },
        'likes',
        1,
      );
    }
  }
  async createPost(createPostDto: any) {
    try {
      const newPost = this.postRepository.create(createPostDto);
      return await this.postRepository.save(newPost);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 커뮤니티에 올라간 덱 입니다');
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
}
