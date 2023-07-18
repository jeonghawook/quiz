import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AtGuard extends AuthGuard('jwt-AT') {
    constructor(private reflector: Reflector) {
        super()
    }
    canActivate(context: ExecutionContext) {
        const passGuard = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass()
        ])
        if (passGuard) return true;

        return super.canActivate(context)
    }
}