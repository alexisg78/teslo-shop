import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  
  private readonly logger = new Logger('ProductService');

  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>

  ){}
  
  
  async create(createProductDto: CreateProductDto) {
    
    try {
      
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save( product );
      return product

    } catch (error) {
      
     this.handleDbExeptions( error );
    
    }

  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  private handleDbExeptions( error: any ){

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error.message);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }

}
