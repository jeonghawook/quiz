import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, SignupDto } from './dtos/users-dtos';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post('/signup')
    async signup(@Body() signupDto: SignupDto): Promise<string> {
        try {
            await this.usersService.signup(signupDto)
            return 'login successful'
        } catch (err) {
            throw err
        }
    }

    @Post('/login')
    async signin(@Body() loginDto: LoginDto) {
        this.usersService.login(loginDto);
    }

    @Post('/logout')
    async logout() {
        this.usersService.logout();
    }

    @Post('/refresh')
    refreshToken() {
        this.usersService.refreshToken();
    }

}
