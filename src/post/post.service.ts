import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Users } from 'src/users/entity/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { FlashcardRepository } from 'src/flashcard/flashcard.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly usersRepository: UsersRepository,
    private readonly flashcardRepository: FlashcardRepository,
  ) {}

  async purchaseFlashcardPost(purchaseInfo: any, user: Users) {
    const userInfo = await this.usersRepository.findUserWithinServer(user);
    if (!userInfo) {
      throw new UnauthorizedException('who are you');
    }

    const postInfo = await this.postRepository.getPostInfo(purchaseInfo.postId);
    if (userInfo.totalTime < postInfo.pointsRequired) {
      throw new BadRequestException('시간이 부족합니다');
    }

    const flashcardInfo = await this.postRepository.getFlashcardofPost(
      postInfo.postId,
    );

    if (flashcardInfo.category.flashcards.length === 0) {
      throw new BadRequestException('내용이 없습니다 다음에 와주세요');
    }

    await this.postRepository.purchaseFlashcardPostAndDecrementUserTime(
      purchaseInfo,
      postInfo,
      user,
      flashcardInfo.category.flashcards,
    );
  }

  async getAllPosts(user: Users) {
    const userPosts = [];
    const otherPosts = [];

    const allPosts = await this.postRepository.getAllPosts();

    allPosts.forEach((data) => {
      const { userToPost, ...postData } = data;
      if (
        data.userId === user.userId ||
        data.userToPost.find((post) => post.userId === user.userId)
      ) {
        const lockedPostData = {
          ...postData,
          locked: false,
        };
        userPosts.push(lockedPostData);
      } else {
        const lockedPostData = {
          ...postData,
          locked: true,
        };
        otherPosts.push(lockedPostData);
      }
    });
    otherPosts.sort((a, b) => b.likes - a.likes);
    return { userPosts: userPosts, otherPosts: otherPosts };
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

  async updateLike(postId: number, user: Users) {
    const postLike = await this.postRepository.validateLike(postId, user);
    if (!postLike) {
      throw new BadRequestException('본인 글은 좋아요가 불가능합니다');
    }
    await this.postRepository.updateLike(postId, postLike);
    return postLike;
  }

  async createPost(createPostDto: any, user: Users) {
    createPostDto.userId = user.userId;
    createPostDto.pointsRequired = 10;
    return await this.postRepository.createPost(createPostDto);
  }

  async updatePost(updatePostDto: any) {
    return await this.postRepository.updatePost(updatePostDto);
  }

  async getPostWithComment(postId: number, user: Users) {
    const postWithContent = await this.postRepository.getPostWithComment(
      postId,
    );

    return {
      ...postWithContent,
      owner: postWithContent.userId === user.userId,
    };
  }

  async validatePostExistence(categoryId: number) {
    const category = await this.flashcardRepository.findOneCateoryForValidation(
      categoryId,
    );
    if (category.hasOwner === true) {
      throw new ConflictException('남의 것은 공부용으로 사용합시다');
    }
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
