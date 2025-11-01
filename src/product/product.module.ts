import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-Image.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),
  ]
})
export class ProductModule {}
