import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { AddProductRequestDto } from 'src/Product.DTO/addproductrequest';
import { AddProductResponesDto } from 'src/Product.DTO/addproductrespones';
import { EditProductRequestDto } from 'src/Product.DTO/editproductrequest';
import { EditProductResponesDto } from 'src/Product.DTO/editproductrespones';
import { DeleteProductRequestDto } from 'src/Product.DTO/delete.product.request';
import { DeleteProductResponesDto } from 'src/Product.DTO/delete.product.respones';
import { FindProductResponesDto } from 'src/Product.DTO/FIndProduct.respones';
import { ListProductResponesDto } from 'src/Product.DTO/listproduct.respones';
import { BuyProductRequestDto } from 'src/Product.DTO/buyproduct.request';
import { BuyProductRespoensDto } from 'src/Product.DTO/buyproductrespones';

@Controller('product')
export class ProductController {
    private readonly productSerivce:ProductService
        constructor(_productSerivce:ProductService){
            this.productSerivce=_productSerivce;
        }

    //상품 등록
    @Post('add')
    async AddProduct(@Body()body:AddProductRequestDto):Promise<AddProductResponesDto>{
        return this.productSerivce.AddProduct(body);
    }   
    //상품 수정
    @Post('edit')
    async EditProduct(@Body()body:EditProductRequestDto):Promise<EditProductResponesDto>{
        return this.productSerivce.EditProduct(body);
    }
    //상품 삭제
    @Post('delete')
    async DeleteProduct(@Body()body:DeleteProductRequestDto):Promise<DeleteProductResponesDto>{
        return this.productSerivce.DeleteProduct(body);
    }
    //상품 조회
    @Get('find')
    async FindProduct(@Query('user_id')user_id:number, @Query('user_pw')user_pw:string):Promise<FindProductResponesDto>{
        return this.productSerivce.FindProduct(user_id,user_pw);
    }
    //리스트 조회
    @Get('list')
    async ProductList():Promise<ListProductResponesDto>{
        return this.productSerivce.ProductList();
    }
    //구매하기
    @Post('buy')
    async BuyProduct(@Body()body:BuyProductRequestDto):Promise<BuyProductRespoensDto>{
        return this.productSerivce.BuyProduct(body);
    }
}
