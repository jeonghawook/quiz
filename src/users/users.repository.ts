import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dtos/users-dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';

Injectable();
export class UsersRepository {
  constructor(@InjectRepository(Users) private users: Repository<Users>) {}

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
        console.log(error);

        if (error.errno == 1062) 
        if (error.sqlMessage.includes('users.IDX_9047b2d58f91586f14f0cf44a4')) {
            throw new ConflictException('User with this email already exists.');
          } else if (error.sqlMessage.includes('users.IDX_ad02a1be8707004cb805a4b502')) {
            throw new ConflictException('User with this nickname already exists.');
          }
    }
  }

  async refreshToken(userId: number): Promise<string> {
    const user = await this.users.findOne({
      where: { userId },
      select: ['refreshToken'],
    });
    return user.refreshToken;
  }
  async removeRefreshToken(userId: number): Promise<void> {
    await this.users.update({ userId }, { refreshToken: null });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    await this.users.update({ userId }, { refreshToken });
  }
}
