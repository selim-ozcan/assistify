import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CommonAuthGuard, CurrentUser, UserDto } from '@soassistify/common';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(CommonAuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: UserDto,
  ) {
    console.log(user);
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
