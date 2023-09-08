import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: '800b8fe2427efbffbef3bc6fe96a5464',
      clientSecret: 'WWyIRm0zec63gzKzSiZYEYgrLIYxbFGq',
      callbackURL: 'https://pocom.shop/users/kakao/callback',
    });
  }

  async validate(accessToken: string, refreshToken: string, data: any) {
    const nickname = data._json.kakao_account;
    return  nickname ;
  }
}
