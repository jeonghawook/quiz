import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Users } from 'src/users/entity/users.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async purchaseFlashcardPost(purchaseInfo: any, user: Users) {
    const userInfo = await this.usersRepository.getTotalTime(user);
    if (!userInfo) {
      throw new UnauthorizedException('who are you');
    }

    const postInfo = await this.postRepository.getPostInfo(purchaseInfo.postId);
    if (userInfo.totalTime < postInfo.pointsRequired) {
      throw new BadRequestException('시간이 부족합니다');
    }

    await this.postRepository.purchaseFlashcardPostAndDecrementUserTime(
      purchaseInfo,
      postInfo,
      user,
    );
  }

  async getAllPosts() {
    return await this.postRepository.getAllPosts();
  }

  async validateUserPost(categoryId: number, postId: number, user: Users) {
    const myPostValidation = await this.postRepository.myPostValidation(
      categoryId,
      user.userId,
    );

    if (myPostValidation) {
      return true;
    }

    const puchaseValidation = await this.postRepository.puchaseValidation(
      postId,
      user.userId,
    );

    if (!puchaseValidation) {
      throw new ConflictException('구매하신 상품이 아닙니다');
    }
    return true;
  }

  async getFlashcardofPost(postId: number, user: Users) {
    const postWithCategory = await this.postRepository.getFlashcardofPost(
      postId,
    );

    const flahscardOnly = postWithCategory.category.flashcards;

    return flahscardOnly;
  }

  async updateLike(postId: number, postLikeInfoDto) {
    return await this.postRepository.updateLike(postId, postLikeInfoDto);
  }

  async createPost(createPostDto: any, user: Users) {
    createPostDto.userId = user.userId;
    //intial point required
    createPostDto.pointsRequired = 10;
    return await this.postRepository.createPost(createPostDto);
  }

  async updatePost(updatePostDto: any) {
    return await this.postRepository.updatePost(updatePostDto);
  }

  async getPostWithComment(postId: number, user: Users) {
    return await this.postRepository.getPostWithComment(postId);
  }

  async validatePostExistence(categoryId: number) {
    const post = await this.postRepository.validatePostExistence(categoryId);
    if (post) {
      throw new ConflictException(
        '이미 커뮤니티에 존재하는 있는 카테고리 입니다',
      );
    }
  }

  async createComment(postId: number, commentDto: any, user: Users) {
    commentDto.userId = user.userId;
    commentDto.postId = postId;
    commentDto.nickname = user.nickname;
    return await this.postRepository.createComment(commentDto);
  }
}
