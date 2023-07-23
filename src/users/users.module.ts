import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RtStrategy } from './strategies/refreshtoken.st';
import { AtStrategy } from './strategies/accesstoken.st';
import { JwtModule } from '@nestjs/jwt';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';

@Module({
  imports: [JwtModule.register({}),
    TypeOrmModule.forFeature([Users]),],
  controllers: [UsersController],
  providers: [UsersService,UsersRepository, AtStrategy, RtStrategy]
})
export class UsersModule { }
