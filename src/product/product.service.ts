import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { isUUID } from 'class-validator';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

  async findAll( paginationDto : PaginationDto) {
    
    const { limit= 10, offset= 0 } = paginationDto

    const product = await this.productRepository.find({
      
      take: limit,
      skip: offset,
      
      // TODO Relaciones
    })

    return product;
  
  }

  async findOne(term: string) {
    
    let product: Product | null = null;
    // const product = await this.productRepository.findOneBy({ id })

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    }else{
      
      const queryBuilder= this.productRepository.createQueryBuilder()

      product = await queryBuilder
        .where(`lower(title) =:title or slug =:slug`, {
          title: term.toLowerCase(),
          slug: term.toLowerCase()
        }).getOne()
    }

    if ( !product )
      throw new NotFoundException(`Product with ${term} not found`);

    return product;
  
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });
    
    if ( !product ) throw new NotFoundException(`Product whit id: ${id} not found`)
    
    try {  
      
      await this.productRepository.save( product )
      return product;

    } catch (error) {
      
      this.handleDbExeptions( error );
      
    }


  }

  async remove(id: string ) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );

  }

  private handleDbExeptions( error: any ){

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error(error.message);
    throw new InternalServerErrorException('Unexpected error, check server logs')

  }

}
