import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsRepository } from './products.repository';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  create(createProductDto: CreateProductDto) {
    return this.productsRepository.create(createProductDto);
  }

  findAll(filter) {
    return this.productsRepository.find(filter ?? {});
  }

  findOne(_id: string) {
    return this.productsRepository.findOne({ _id });
  }

  async update(_id: string, updateProductDto: UpdateProductDto) {
    await this.productsRepository.update(_id, updateProductDto);
  }
}
