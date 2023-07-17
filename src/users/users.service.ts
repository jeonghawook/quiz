import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { Users } from './users.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
    private userRepository: UsersRepository
    private jwtService: JwtService




    async signup(signupDto: SignupDto): Promise<void> {
        const hashedPassword = await bcrypt.hash(signupDto.password, 2)
        await this.userRepository.signup(signupDto, hashedPassword)
    }


    async getTokens(user: Users): Promise<Tokens> {
        const [accessToken, refreshToken] = [
            await this.getAccessToken(user),
            await this.getRefreshToken(user),
        ]
        return { refreshToken, accessToken }
    }
    async getRefreshToken(user: Users): Promise<string> {
        const { nickname, rank, userId, isActive } = user;
        return await this.jwtService.signAsync({
            nickname,
            rank,
            userId,
            isActive
        },
            {
                secret: "life4u",
                expiresIn: '7d'
            }
        )

    }
    async getAccessToken(user: Users): Promise<string> {
        const { nickname, rank, userId, isActive } = user;
        return await this.jwtService.signAsync({
            nickname,
            rank,
            userId,
            isActive
        },
            {
                secret: "life4u",
                expiresIn: '3h'
            }
        )
    }



    async login(loginDto: LoginDto): Promise<Tokens> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findEmail(email)
        if (!user.userEmail) throw new NotFoundException('존재하지 않는 이메일입니다.');
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

        const tokens = await this.getTokens(user)

        // await this.client.set(
        //     `user:${user.userId}:refresh_token`,
        //     tokens.refreshToken,
        // );
        return

    }
    logout() { }
    refreshToken() { }
}
