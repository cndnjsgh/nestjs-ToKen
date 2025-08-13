import { Body, Controller, Get, Header, Headers, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterRequestDto } from 'src/User.DTO/userregister.request';
import { UserRegisterResqonesDto } from 'src/User.DTO/userregister.respones';
import { UserListResponesDto } from 'src/User.DTO/userlist.respones';
import { UserFindResponesDto } from 'src/User.DTO/userfind.respones';
import { UserDeleteRespones } from 'src/User.DTO/userdeleterespones';
import { UserDeleteRequestDto } from 'src/User.DTO/userdeleterequest';
import { LoginDto } from 'src/User.DTO/logindto';
import { Request, Response } from 'express';
import { UserGuard } from 'src/security/user.guard';
import { TokenRes } from 'src/User.DTO/token.respones';

@Controller('user')
export class UserController {
    private readonly userService:UserService
    constructor(_userService:UserService){
        this.userService=_userService;
    }

    @Post('register')
    async UserRegister(@Body() body:UserRegisterRequestDto):Promise<UserRegisterResqonesDto>{
        return this.userService.register(body);
    }

    @Post('login')
    async Login(@Body() body:LoginDto):Promise<TokenRes>{
        return this.userService.Login(body);
    }

    @Get('accesstoken')
    async GetAccessToken(@Headers('chu') chu:string){
        return this.userService.GetAccessToken(chu);
    }

    @Get('get_name')
    @UseGuards(UserGuard)
    async getName(@Headers('chu') chu:string){
        return this.userService.GetName(chu);
    }

    @Get('userlist')
    async UserList():Promise<UserListResponesDto>{
        return this.userService.UserList();
    }

    @Get('userfind')
    async Userfind(@Query('user_name')user_name:string):Promise<UserFindResponesDto>{
        return this.userService.UserFind(user_name);
    }

    @Post('userdelete')
    async UserDelete(@Body()body:UserDeleteRequestDto):Promise<UserDeleteRespones>{
        return this.userService.Userdelete(body);
    }
}
