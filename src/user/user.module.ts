import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Product } from 'src/product/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/security/passport.jwt.strategy';

@Module({
  imports:[TypeOrmModule.forFeature([User,Product]),
           JwtModule.register({
            secret:'SECRET',
            signOptions:{expiresIn:'300s'},
           }),PassportModule
          ],
  exports: [TypeOrmModule,JwtModule],
  providers: [UserService,JwtStrategy],
  controllers:[UserController],
})
export class UserModule {}
