import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RtStrategy } from './strategies/refreshtoken.st';
import { AtStrategy } from './strategies/accesstoken.st';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { KakaoStrategy } from './strategies/kakao.st';
import { InMemoryModule } from 'src/in-memory/in-memory.module';

@Module({
  imports: [
    JwtModule.register({ secret: 'RTlife4u' }),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    AtStrategy,
    RtStrategy,
    KakaoStrategy,
  ],
})
export class UsersModule {}
