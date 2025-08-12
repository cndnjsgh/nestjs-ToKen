import { UserRegisterRequestDto } from "src/User.DTO/userregister.request";
import { Product } from "src/product/product.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    PK: number;

    @Column()
    user_id: number;

    @Column()
    user_pw: string;

    @Column()
    user_name: string;

    @Column()
    seller: boolean;

    @OneToMany(()=>Product,(product)=>product.user,{
        cascade:true,
        onDelete: 'CASCADE',
    })
    product: Product[];

    setter(dto:UserRegisterRequestDto){
        this.user_id=dto.user_id;
        this.user_pw=dto.user_pw;
        this.user_name=dto.user_name;
        this.seller=dto.seller;
    }
}