import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CommonAuthGuard } from '@soassistify/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchFilterDto } from './dto/search-filter.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(CommonAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query()
    filter: Partial<SearchFilterDto>, //Partial<Pick<CreateProductDto, 'colors' | 'material' | 'sizes'>>,
  ) {
    return this.productsService.findAll(filter);
  }

  @UseGuards(CommonAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}
