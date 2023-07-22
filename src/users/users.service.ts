import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { Users } from './users.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class UsersService {
    private userRepository: UsersRepository
    private jwtService: JwtService
    @InjectRedis('notValuable') private readonly client: Redis,




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
                secret: "RTlife4u",
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
                secret: "ATlife4u", //env 파일에 저장할것
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
        //    `${user.userId}:RT`,
        //     tokens.refreshToken,
        // );
        return tokens

    }
    async logout(user: Users) {
        // await user.userId
    }


    async refreshToken(user: Users, refreshToken: string): Promise<string> {
        let RTfromRedis = await this.client.get(`${user.userId}:RT`)
        if (!RTfromRedis) {
            RTfromRedis = await this.userRepository.refreshToken(user.userId)
            if (!RTfromRedis) throw new UnauthorizedException('다시 로그인해주세요'); //프론트에서도 없애는 방법을 찾아야함
            await this.client.set(`${user.userId}:RT`, RTfromRedis)
        }
        if (refreshToken !== RTfromRedis)
        //1.레디스에 없을때 2.요청과 다를때 3.기간이 다 됬으떄 4.
        
        throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              error: '로그인이 필요합니다.',
              code: '333', // Add your custom error code here
            },
            HttpStatus.UNAUTHORIZED,
          );

        return await this.getAccessToken(user)
    }
}
