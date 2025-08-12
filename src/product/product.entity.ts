import { AddProductRequestDto } from "src/Product.DTO/addproductrequest";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    product_id: number;

    @Column()
    product_name: string;

    @Column()
    product_info: string;

    @Column()
    product_price: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @ManyToOne(() => User,{onDelete:'CASCADE'})
    @JoinColumn()
    user: User;

    Productsetter(dto:AddProductRequestDto){
        this.product_name=dto.product_name;
        this.product_info=dto.product_info;
        this.product_price=dto.product_price;
    }
}