import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { off } from 'process';
import { isNumber } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
  
    try {
      const producto = this.productRepository.create(createProductDto);
      await this.productRepository.save(producto);

      return producto

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0} = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: Relaciones
    });
  }


  async findOne(term: string) {
    
    let producto: Product;
    
    if( isNumber(+term) ){
      producto = await this.productRepository.findOneBy({ id: +term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();

      producto = await queryBuilder
                          .where('UPPER(title) =:title or slug =:slug', {
                            title: term.toUpperCase(),
                            slug: term.toLowerCase(),
                          }).getOne();
    }
    
    if(!producto)
      throw new NotFoundException(`Product with ${term} not found`);

    return producto;
  }


  async update(id: number, updateProductDto: UpdateProductDto) {

    const producto = await this.productRepository.preload({
      id: id,
      ...updateProductDto
    });

    if(!producto)
      throw new NotFoundException(`Product with id ${id} not found`);
    
    try {
      await this.productRepository.save( producto );
      return producto;

    } catch (error) {
      this.handleDBExceptions(error);
    
    }
  }


  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productRepository.remove( producto ); 
  }



  private handleDBExceptions( error: any ){

    if( error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
