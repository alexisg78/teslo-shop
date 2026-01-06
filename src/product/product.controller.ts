import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { ProductService } from './product.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Auth()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productService.create( createProductDto, user );
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto ) {
    return this.productService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
 
    // return this.productService.findOne(term);
    return this.productService.findOnePlain(term);
 
  }

  @Patch(':id')
  @Auth( ValidRoles.admin )
  update(
    @Param( 'id', ParseUUIDPipe ) id: string,  
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productService.update( id, updateProductDto, user );
  }

  @Delete(':id')
  @Auth( ValidRoles.admin )
  remove(@Param('id', ParseUUIDPipe ) id: string) {
    return this.productService.remove(id);
  }
}
