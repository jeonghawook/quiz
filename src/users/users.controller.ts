import { Body, Controller, HttpException, HttpStatus, Post, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
import { Users } from './users.entity';
import { GetUser, Public } from './common/decorators';
import { RTGuard } from './common/guards/rt.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Public()
    @Post('/signup')
    async signup(@Body() signupDto: SignupDto): Promise<{ statusCode: number }> {
        try {
            await this.usersService.signup(signupDto)
            return { statusCode: HttpStatus.CREATED }
        } catch (err) {
            throw err
        }
    }

    @Public()
    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<Tokens> {
        try {

            const tokens = await this.usersService.login(loginDto);

            return tokens

        } catch (error) {

            throw error

        }
    }

    @Delete('/logout')
    async logout(@GetUser() user: Users): Promise<{ message: string }> {
        try {
            await this.usersService.logout(user);
            return { message: '로그아웃 되었습니다.' };

        } catch (error) {
            throw error
        }

    }
    @Public()
    @UseGuards(RTGuard)
    @Post('/refresh')
    async refreshToken(
        @GetUser('refreshToken') refreshToken: string,
        @GetUser() user: Users)
        : Promise<{ accessToken: string }> {
        try {
console.log("HIT")
console.log(refreshToken)
            const accessToken = await this.usersService.refreshToken(user, refreshToken);

            return { accessToken };
        }
        catch (error) {
            throw error;
        }
    }
}
