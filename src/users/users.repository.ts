import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, PasswordDto, SignupDto } from './dtos/users-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/users.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(Users) private users: Repository<Users>) {}

  async findUserWithinServer(userEmail: string) {
    return await this.users.findOne({ where: { userEmail } });
  }

  async getTotalTime(user: Users) {
    return await this.users.findOneBy({
      userId: user.userId,
    });
  }

  async socialSignUp(userEmail: string, nickname: string) {
    try {
      const user = this.users.create({
        userEmail: userEmail,
        nickname: nickname,
      });
      await this.users.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findEmail(userEmail: string): Promise<Users> {
    return await this.users.findOne({ where: { userEmail } });
  }

  async signup(signupDto: SignupDto, hashedPassword: string): Promise<void> {
    try {
      const user = this.users.create({
        userEmail: signupDto.userEmail,
        nickname: signupDto.nickname,
        userName: signupDto.userName,
        password: hashedPassword,
      });

      await this.users.save(user);
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint === 'UQ_9047b2d58f91586f14f0cf44a45') {
          throw new ConflictException('이미 존재하는 이메일 입니다');
        } else if (error.constraint === 'UQ_ad02a1be8707004cb805a4b5023') {
          throw new ConflictException('이미 존재하는 닉네임 입니다');
        }
        console.log(error);
      }
    }
  }

  async refreshToken(userId: number): Promise<string> {
    try {
      const user = await this.users.findOne({
        where: { userId },
        select: ['refreshToken'],
      });
      return user.refreshToken;
    } catch (error) {
      throw new UnauthorizedException('다시 로그인해주세요');
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.users.update({ userId }, { refreshToken: null });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.users.update({ userId }, { refreshToken });
  }

  async getProfile(user: Users) {
    return await this.users.findOneOrFail({
      select: {
        userEmail: true,
        nickname: true,
        emailVerificationStatus: true,
        totalTime: true,
      },
      where: { userId: user.userId },
    });
  }

  async changePassword(user: Users, hashedPassword: string) {
    return await this.users.update(
      { userId: user.userId },
      { password: hashedPassword },
    );
  }

  async confirmEmailVerification(user: Users) {
    return await this.users.update(
      { userId: user.userId },
      { emailVerificationStatus: true },
    );
  }

  async changeNickname(user: Users, nickname: string) {
    try {
      return await this.users.update({ userId: user.userId }, { nickname });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 닉네임 입니다');
      }
    }
  }
}
