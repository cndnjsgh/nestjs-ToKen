import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { AddProductRequestDto } from 'src/Product.DTO/addproductrequest';
import { AddProductResponesDto } from 'src/Product.DTO/addproductrespones';
import { EditProductRequestDto } from 'src/Product.DTO/editproductrequest';
import { EditProductResponesDto } from 'src/Product.DTO/editproductrespones';
import { DeleteProductRequestDto } from 'src/Product.DTO/delete.product.request';
import { DeleteProductResponesDto } from 'src/Product.DTO/delete.product.respones';
import { FindProductResponesDto } from 'src/Product.DTO/FIndProduct.respones';
import { ProductModule } from './product.module';
import { ListProductResponesDto } from 'src/Product.DTO/listproduct.respones';
import { BuyProductRequestDto } from 'src/Product.DTO/buyproduct.request';
import { BuyProductRespoensDto } from 'src/Product.DTO/buyproductrespones';

@Injectable()
export class ProductService {
    constructor(
            @InjectRepository(User)
            private userRepository: Repository<User>,
            @InjectRepository(Product)
            private productRepository: Repository<Product>,
        ){}

    //상품 등록
   async AddProduct(body:AddProductRequestDto):Promise<AddProductResponesDto>{
    const finduser= await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}});
    if(!finduser){
        throw new NotFoundException();
    }
    if(!finduser.seller){
        throw new BadRequestException('당신은 구매자 입니다!');
    }
    const product:Product = new Product();
    product.Productsetter(body);
    this.productRepository.save(product);
    const text:AddProductResponesDto = new AddProductResponesDto();
    text.text='상품들록에 성공하였습니다!';
    return text;
   }

   //상품 수정
   async EditProduct(body:EditProductRequestDto):Promise<EditProductResponesDto>{
    const finduser= await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}});
    if(!finduser){
        throw new NotFoundException();
    }
    if(!finduser.seller){
        throw new BadRequestException('당신은 구매자 입니다!');
    }
    const product:Product = new Product();
    product.Productsetter(body);
    this.productRepository.save(product);
    const text:EditProductResponesDto = new EditProductResponesDto();
    text.text='수정하였습니다!';
    return text;
   }

   //상품 삭제
   async DeleteProduct(body:DeleteProductRequestDto):Promise<DeleteProductResponesDto>{
    const finduser= await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}});
    if(!finduser){
        throw new NotFoundException();
    }
    if(!finduser.seller){
        throw new BadRequestException('당신은 구매자 입니다!');
    }
    const findproduct=await this.productRepository.findOne({where:{product_id:body.product_id}});
    if(!findproduct)
    {
        throw new NotFoundException();
    }
    if(finduser.user_id!=findproduct.user.user_id||finduser.user_pw!=findproduct.user.user_pw){
        throw new BadRequestException('상품을 삭제할 수 업습니다!');
    }
    this.productRepository.remove(findproduct);
    const text:DeleteProductResponesDto = new DeleteProductResponesDto();
    text.text='삭제하였습니다!';
    return text;
   }

   //회원 상품 조회
   async FindProduct(user_id:number,user_pw:string):Promise<FindProductResponesDto>{
    const finduser= await this.userRepository.findOne({where:{user_id:user_id,user_pw:user_pw}});
    if(!finduser){
        throw new NotFoundException();
    }
    if(!finduser.seller){
        throw new BadRequestException('당신은 구매자 입니다!');
    }
    const product:FindProductResponesDto = new FindProductResponesDto();
    product.product=finduser.product;
    return product;
   }

   //모든 상품 조회
   async ProductList():Promise<ListProductResponesDto>{
    const productlist = await this.productRepository.find();
    const list:ListProductResponesDto = new ListProductResponesDto();
    list.product=productlist;
    return list;
   }

   //구매하기
   async BuyProduct(body:BuyProductRequestDto):Promise<BuyProductRespoensDto>{
    const finduser= await this.userRepository.findOne({where:{user_id:body.user_id,user_pw:body.user_pw}});
    if(!finduser){
        throw new NotFoundException();
    }
    const findproduct = await this.productRepository.findOne({where:{product_name:body.product_name}});
    if(!findproduct){
        throw new NotFoundException();
    }
    this.productRepository.remove(findproduct);
    const text:BuyProductRespoensDto = new BuyProductRespoensDto();
    text.text = '구매하였습니다!';
    return text;
   }
}
