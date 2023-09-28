import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: '8ffafcf35ddb5077a2c8b940e4b01da1',
      clientSecret: 'WWyIRm0zec63gzKzSiZYEYgrLIYxbFGq',
      callbackURL: 'https://pocom.shop/users/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, data: any) {
    const response = data._json.kakao_account;
    const nickname = response.profile.nickname
    const email = response.email
    const user = {
      nickname,
      email
    }
    return  user ;
  }
}
