import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RtStrategy } from './strategies/refreshtoken.st';
import { AtStrategy } from './strategies/accesstoken.st';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService, AtStrategy, RtStrategy]
})
export class UsersModule { }
