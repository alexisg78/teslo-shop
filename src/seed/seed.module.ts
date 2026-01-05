import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { ProductModule } from 'src/product/product.module';

import { ProductService } from 'src/product/product.service';
import { SeedService } from './seed.service';
import { AuthModule } from './../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [ SeedService, ProductService  ],
  imports:[ 
    ProductModule,
    AuthModule
   ]
})
export class SeedModule {}
