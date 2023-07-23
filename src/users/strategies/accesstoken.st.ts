import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-AT') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "ATlife4u"

        })
    }
    validate(payload: any) {
        return payload;
        // 위에 이 뜻임 req.user = payload;
    }
}