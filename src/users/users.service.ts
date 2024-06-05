import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, PasswordDto, SignupDto, Tokens } from './dtos/users-dtos';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { Users } from './entity/users.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRedis('notValuable') private readonly client: Redis,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(signupDto.password, 2);
    await this.userRepository.signup(signupDto, hashedPassword);
  }

  async getTokens(user: Users): Promise<Tokens> {
    const [accessToken, refreshToken] = [
      await this.getAccessToken(user),
      await this.getRefreshToken(user),
    ];
    return { refreshToken, accessToken };
  }
  async getRefreshToken(user: Users): Promise<string> {
    const { nickname, rank, userId, isActive, userEmail } = user;
    return await this.jwtService.signAsync(
      {
        userEmail,
        nickname,
        rank,
        userId,
        isActive,
      },
      {
        secret: this.configService.get<string>('REFRESH'),
        expiresIn: this.configService.get<string>('REFRESHEXP'),
      },
    );
  }
  async getAccessToken(user: Users): Promise<string> {
    const { nickname, rank, userId, isActive, userEmail } = user;
    return await this.jwtService.signAsync(
      {
        userEmail,
        nickname,
        rank,
        userId,
        isActive,
      },
      {
        secret: this.configService.get<string>('ACCESS'),
        expiresIn: this.configService.get<string>('ACCESSEXP'),
      },
    );
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const { userEmail, password } = loginDto;

    const user = await this.userRepository.findEmail(userEmail);

    if (!user) throw new NotFoundException('존재하지 않는 이메일입니다.');

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    const tokens = await this.getTokens(user);
    await this.userRepository.setRefreshToken(user.userId, tokens.refreshToken);
    await this.client.set(`${user.userId}:RT`, tokens.refreshToken);
    return tokens;
  }
  async logout(user: Users) {
    // await user.userId
  }

  async refreshToken(user: Users, refreshToken: string): Promise<string> {
    //1.레디스에 없을때
    let RTfromRedis = await this.client.get(`${user.userId}:RT`);
    if (!RTfromRedis) {
      RTfromRedis = await this.userRepository.refreshToken(user.userId);

      if (!RTfromRedis) throw new UnauthorizedException('다시 로그인해주세요'); //프론트에서도 없애는 방법을 찾아야함
      await this.client.set(`${user.userId}:RT`, RTfromRedis);
    }
    //2.요청과 다를때
    if (refreshToken !== RTfromRedis) {
      await this.client.del(`${user.userId}:RT`);
      await this.userRepository.removeRefreshToken(user.userId);
      //위에 UnauthorizedException으로 해결할수있으면 수정하기
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: '로그인이 필요합니다.',
          code: '333',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    //4.문제 없다면!
    return await this.getAccessToken(user);
  }

  async socialLogin(nickname: string, userEmail: string): Promise<Tokens> {
    let user = await this.userRepository.findEmail(userEmail);
    if (!user) {
      user = await this.userRepository.socialSignUp(userEmail, nickname);
    }

    const tokens = await this.getTokens(user);
    await this.userRepository.setRefreshToken(user.userId, tokens.refreshToken);
    await this.client.set(`${user.userId}:RT`, tokens.refreshToken);
    return tokens;
  }

  async removeToken() {}

  async saveCode(user: Users, code: string) {
    return await this.client.set(`${user.userEmail}`, `${code}`);
  }

  async confirmVerificationEmail(user: Users, verificationInfo: any) {
    const code = await this.client.get(`${user.userEmail}`);
    if (code !== verificationInfo.code) {
      throw new UnauthorizedException('코드가 일치하지 않습니다');
    }
    return await this.userRepository.confirmEmailVerification(user);
  }

  async getProfile(user: Users) {
    return await this.userRepository.getProfile(user);
  }

  async changePassword(user: Users, passwordDto: PasswordDto) {
    const { password } = await this.userRepository.findUserWithinServer(
      user.userEmail,
    );
    if (password !== passwordDto.password) {
      throw new UnauthorizedException('기존 비밀번호를 확인해주세요');
    }
    return await this.userRepository.changePassword(user, passwordDto);
  }
}
