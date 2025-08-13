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
import { LoginDto } from 'src/User.DTO/logindto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/security/payload.interface';
import { tokennn } from 'src/User.DTO/token';
import { GetNameResponesDto } from 'src/User.DTO/getnameres';
import { RefreshToken } from 'src/User.DTO/refreshtoken';
import { PayLoadDto } from 'src/security/PayloadDto';
import { TokenRes } from 'src/User.DTO/token.respones';
import { UpDateRefreshToken } from 'src/User.DTO/updaterefreshtoken';

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
    async Login(body:LoginDto):Promise<TokenRes>{
        const user = await this.userRepository
        .createQueryBuilder('u')
        .where('u.user_id = :user_id',{user_id: body.user_id})
        .andWhere('u.user_pw = :user_pw', {user_pw: body.user_pw})
        .getOne();
        if(!user){
            throw new NotFoundException();
        }
        //accesstoken에는 body에 있는 id와 pw를 저장
        const accesstoken = await this.GenerateAccessToken(body);
        //refreshtoken에는 찾은 user의 pk저장
        const refreshtoken = await this.GenerateRefreshToken(user.PK);
        const res:TokenRes = new TokenRes();
        res.AccessToken=accesstoken.accessToKen;
        res.RefreshToken=refreshtoken.refreshtoken;
        const data:UpDateRefreshToken = new UpDateRefreshToken();
        data.PK=user.PK;
        data.refreshtoken=res.RefreshToken;
        data.refreshtokenExp= await this.getRefreshTokenExp();
        this.UpDateRefreshToken(data);
        return res;
    }
    //Access Token 생성
    GenerateAccessToken(userdata:LoginDto):tokennn{
        const Token:tokennn = new tokennn();
        const payload = {
            user_id: userdata.user_id,
            user_pw: userdata.user_pw
        };
        Token.accessToKen=this.jwtService.sign(payload,{
            secret: 'cndnjsgh',
            expiresIn: '1m',
        });
        return Token;
    }

    //Refresh Token 생성
    GenerateRefreshToken(pk:number){
        const payload = {pk};

        const refreshtoken = this.jwtService.sign(payload,{
            secret: 'cndnjsgh1234',
            expiresIn: '1h', 
        });
        const retoken:RefreshToken = new RefreshToken();
        retoken.refreshtoken=refreshtoken;
        return retoken;
    }
    
    async GetAccessToken(chu:string){
        return await this.RefreshAccessToken(chu);
    }

    //Refresh Token 유효성 검사
    async ValidateRefresh(refreshtoken:string):Promise<any>{
        const user = await this.FindOneByRefresehToken(refreshtoken);
        return user;
    }

    //access token 재발급
    async RefreshAccessToken(retoken:string){
        //decode 함수는 토큰의 payload 부분을 포함한 객체를 반환
        const payload: any = this.jwtService.decode(retoken);
        const user = await this.FindOneByPk(payload.pk);
        if(retoken === user.refreshtoken){
            const accesstoken = this.GenerateAccessToken({
                user_id:user.user_id,
                user_pw:user.user_pw,
            });
            return accesstoken;
        }
        else{
            return false;
        }
    }

    //RefreshToken 유효 기간 생성
    async getRefreshTokenExp():Promise<Date>{
        const nowDate = new Date();
        const refreshtokenExp = new Date(nowDate.getTime() + parseInt('1800000'));
        return refreshtokenExp;

    }    
    //RefreshToken을 DB에 저장
    async UpDateRefreshToken(data:UpDateRefreshToken):Promise<void>{
        await this.userRepository.update({PK:data.PK},
            {
                refreshtoken:data.refreshtoken,
                refreshtokenExp:data.refreshtokenExp,
            },);
    }

    //pk를 조건으로 사용하여 user엔티티 조회
    async FindOneByPk(PK:number):Promise<User>{
        const user = await this.userRepository.findOneBy({PK});
        if(!user){
            throw new NotFoundException();
        }
        return user;
    }

    async FindOneByRefresehToken(refreshtoken:string):Promise<User>{
        const user = await this.userRepository.findOneBy({refreshtoken});
        if(!user){
            throw new NotFoundException();
        }
        return user;
    }   

    //이름 추출
    async GetName(pk:string){
        const user = await this.userRepository
        .createQueryBuilder('u')
        .where('u.PK = :PK',{PK:Number(pk)})
        .getOne();

        if(!user){
            throw new NotFoundException();
        }

        return new GetNameResponesDto(user.user_name);
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
