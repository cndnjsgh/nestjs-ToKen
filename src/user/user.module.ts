import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Product } from 'src/product/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[TypeOrmModule.forFeature([User,Product]),JwtModule,PassportModule],
  exports: [TypeOrmModule,JwtModule],
  providers: [UserService],
  controllers:[UserController],
})
export class UserModule {}
