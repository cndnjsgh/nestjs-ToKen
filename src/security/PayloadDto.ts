import { LoginDto } from "src/User.DTO/logindto";

export class PayLoadDto{
    user_id:number;
    user_pw:string;

    constructor(userData:LoginDto){
        this.user_id=userData.user_id;
        this.user_pw=userData.user_pw;
    }
    
}