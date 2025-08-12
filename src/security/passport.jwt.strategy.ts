import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private userService:UserService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'SECRET',
        })
    }
    async validate(payload: Payload, done: VerifiedCallback):Promise<any>{
        const user = await this.userService.tokenValidateUser(payload);
        if(!user){
            return done(new UnauthorizedException({message: 'user does not exist'}), false);
        }
        return done(null,user);
    }
}