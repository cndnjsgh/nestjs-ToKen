import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Product } from 'src/product/product.entity';
import { UserRegisterRequestDto } from 'src/User.DTO/userregister.request';
import { UserRegisterResqonesDto } from 'src/User.DTO/userregister.respones';
import { UserListResponesDto } from 'src/User.DTO/userlist.respones';
import { UserFindResponesDto } from 'src/User.DTO/userfind.respones';
import { UserDeleteRespones } from 'src/User.DTO/userdeleterespones';
import { UserDeleteRequestDto } from 'src/User.DTO/userdeleterequest';
import { UserDto } from 'src/User.DTO/logindto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/security/payload.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService:JwtService,
    ){}
    //회원가입
    async register(body:UserRegisterRequestDto):Promise<UserRegisterResqonesDto>{
        const userData:User = new User();
        userData.setter(body)
        const finduser = await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}})
        if(finduser){
            throw new BadRequestException();
        }
        await this.userRepository.save(userData);
        const re:UserRegisterResqonesDto = new UserRegisterResqonesDto();
        re.text='회원가입에 성공하였습니다!';
        return re;
    }

    //로그인
    async Login(userDTO:UserDto):Promise<{accessToKen:string}|undefined>{
        let userFind: User|null = await this.findByFields({
            where:{user_id:userDTO.user_id}
        });
        if(!userFind){
            throw new UnauthorizedException();
        }
        const userok:User|null = await this.userRepository.findOne({where:{user_id:userDTO.user_id,user_pw:userDTO.user_pw}});
        if(!userok){
            throw new UnauthorizedException();
        }
        const payload: Payload = {id: userFind.user_id, username: userFind.user_name};
        return {
            accessToKen:this.jwtService.sign(payload),
        };
    }

    async findByFields(options: FindOneOptions<UserDto>): Promise<User | null> {
        return await this.userRepository.findOne(options);
    }

    async tokenValidateUser(payload: Payload): Promise<UserDto|null> {
    return await this.findByFields({
        where: { user_id: payload.id }
    });
}

    //회원 전체 조회
    async UserList():Promise<UserListResponesDto>{
        const UserData:User[]= await this.userRepository.find({select:["user_name","seller"]});
        const Userlist:UserListResponesDto = new UserListResponesDto();
        Userlist.user=UserData;
        return Userlist;

    }

    //특정 회원 조회
    async UserFind(name:string):Promise<UserFindResponesDto>{
        const finduser:User[]= await this.userRepository.find({select:["user_name","seller"],where:{user_name:name}})
        if(!finduser)
        {
            throw new NotFoundException('회원을 찾지 못했습니다!');
        }
        const user:UserFindResponesDto = new UserFindResponesDto();
        user.user=finduser;
        return user;
    }
    //회원탈퇴
    async Userdelete(body:UserDeleteRequestDto):Promise<UserDeleteRespones>{
        const finduser=await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}});
        if(!finduser)
        {
            throw new BadRequestException();
        }
        this.userRepository.remove(finduser);
        const text:UserDeleteRespones = new UserDeleteRespones();
        text.text='탈퇴하였습니다!';
        return text;
    }
}
