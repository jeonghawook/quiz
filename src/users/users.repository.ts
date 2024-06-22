import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, PasswordDto, SignupDto } from './dtos/users-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Users } from './entity/users.entity';
import { Time } from 'src/time/entities/time.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly dataSource: DataSource,
  ) {}

  async findUserWithinServer(userEmail: string) {
    return await this.usersRepository.findOne({ where: { userEmail } });
  }

  async getTotalTime(user: Users) {
    return await this.usersRepository.findOneBy({
      userId: user.userId,
    });
  }

  async socialSignUp(userEmail: string, nickname: string) {
    try {
      const user = this.usersRepository.create({
        userEmail: userEmail,
        nickname: nickname,
      });
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async findEmail(userEmail: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { userEmail } });
  }

  async signup(signupDto: SignupDto, hashedPassword: string): Promise<void> {
    try {
      const user = this.usersRepository.create({
        userEmail: signupDto.userEmail,
        nickname: signupDto.nickname,
        userName: signupDto.userName,
        password: hashedPassword,
      });

      await this.usersRepository.save(user);
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
      const user = await this.usersRepository.findOne({
        where: { userId },
        select: ['refreshToken'],
      });
      return user.refreshToken;
    } catch (error) {
      throw new UnauthorizedException('다시 로그인해주세요');
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    await this.usersRepository.update({ userId }, { refreshToken: null });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.usersRepository.update({ userId }, { refreshToken });
  }

  async getProfile(user: Users) {
    return await this.usersRepository.findOneOrFail({
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
    return await this.usersRepository.update(
      { userId: user.userId },
      { password: hashedPassword },
    );
  }

  async confirmEmailVerification(user: Users) {
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Users,
          { userId: user.userId },
          { emailVerificationStatus: true },
        );
        const time = new Time();
        time.userId = user.userId;
        time.timeCharged = 50;
        time.timeTransactionInfo = 'email-varification';

        const timeInfo = transactionalEntityManager.create(Time);
        await transactionalEntityManager.save(Time, time);

        await transactionalEntityManager.increment(
          Users,
          { userId: user.userId },
          'totalTime',
          time.timeCharged,
        );
      },
    );
  }

  async changeNickname(user: Users, nickname: string) {
    try {
      return await this.usersRepository.update(
        { userId: user.userId },
        { nickname },
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 닉네임 입니다');
      }
    }
  }
}
