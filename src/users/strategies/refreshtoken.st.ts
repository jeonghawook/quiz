import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express'
import { Injectable } from "@nestjs/common";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-RT') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "RTlife4u",
            passReqToCallback: true
            //해독 + 토큰 그 자체
        })
    }
    validate(req: Request, payload: any) {
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();

        return { ...payload, refreshToken }

        // 위에 이 뜻임 req.user = payload & refreshtoken;
    }
}