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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
import { Users } from './users.entity';
import { GetUser, Public } from './common/decorators';
import { RTGuard } from './common/guards/rt.guard';
import { AuthGuard } from '@nestjs/passport';

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
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    try {
      console.log('running');
      const tokens = await this.usersService.login(loginDto);

      return tokens;
    } catch (error) {
      throw error;
    }
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
  @Public()
  @UseGuards(RTGuard)
  @Post('/refresh')
  async refreshToken(
    @GetUser('refreshToken') refreshToken: string,
    @GetUser() user: Users,
  ): Promise<{ accessToken: string }> {
    try {
      console.log('HIT');
      console.log(refreshToken);
      const accessToken = await this.usersService.refreshToken(
        user,
        refreshToken,
      );

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }

  @Public()
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    console.log(1);
  }

  @Public()
  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginCallback(@Req() req) {
    console.log(req.user.profile.nickname);
    const nickname = req.user.profile.nickname;
    const userEmail = req.user.email;
    const tokens = await this.usersService.socialLogin(nickname, userEmail);
    return tokens;
  }
}
