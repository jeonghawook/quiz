import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Delete,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
import { Users } from './entity/users.entity';
import { GetUser, Public } from './common/decorators';
import { RTGuard } from './common/guards/rt.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Public()
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ statusCode: number }> {
    try {
      await this.usersService.signup(signupDto);
      return { statusCode: HttpStatus.CREATED };
    } catch (err) {
      throw err;
    }
  }

  @Public()
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.usersService.login(loginDto);
  }

  @Delete('/logout')
  async logout(@GetUser() user: Users): Promise<{ message: string }> {
    try {
      await this.usersService.logout(user);
      return { message: '로그아웃 되었습니다.' };
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(RTGuard)
  @Post('/refresh')
  async refreshToken(
    @GetUser('refreshToken') refreshToken: string,
    @GetUser() user: Users,
  ): Promise<{ accessToken: string }> {
    try {
      const accessToken = await this.usersService.refreshToken(
        user,
        refreshToken,
      );

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }

  // @Public()
  // @Patch('refreshToken/remove')
  // removeToken(){
  //   return this.usersService.
  // }

  @Public()
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {}

  @Public()
  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req, @Res() res: Response) {
    const nickname = req.user.profile.nickname;
    const userEmail = req.user.email;
    const tokens = await this.usersService.socialLogin(nickname, userEmail);
    res.redirect('https://');
    return tokens;
  }
}
