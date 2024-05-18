import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-AT') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('ACCESS'),
    });
  }

  validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid token or token expired');
    }
    return payload;
    // 위에 이 뜻임 req.user = payload;
  }
}
