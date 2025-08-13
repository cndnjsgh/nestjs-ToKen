import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Observable } from "rxjs";
import { Payload } from "./payload.interface";
@Injectable()
export class UserGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService){}
    canActivate(
        context: ExecutionContext)
        : boolean | Promise<boolean> | Observable<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const token = request.headers['chu'];

        if(!token){
            return false;
        }

        if(Array.isArray(token)){
            return false;
        }
        const payload: Payload = this.jwtService.verify(token,{
            secret: 'cndnjsgh',
        });
        
        request.headers['chu'] = payload.pk.toString();

        return true;
    }
}