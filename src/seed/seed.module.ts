import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { ProductModule } from 'src/product/product.module';

import { ProductService } from 'src/product/product.service';
import { SeedService } from './seed.service';

@Module({
  controllers: [SeedController],
  providers: [ SeedService, ProductService  ],
  imports:[ ProductModule ]
})
export class SeedModule {}
