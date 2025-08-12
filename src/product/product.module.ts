import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports:[TypeOrmModule.forFeature([User,Product])],
    exports:[TypeOrmModule.forFeature([Product])],
    controllers:[ProductController],
    providers:[ProductService]
})
export class ProductModule {}
