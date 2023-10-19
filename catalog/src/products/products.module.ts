import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from '@soassistify/common';
import { LoggerModule } from '@soassistify/common';
import { ProductDocument, ProductSchema } from './models/product.schema';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    DatabaseModule.forFeature([
      { name: ProductDocument.name, schema: ProductSchema },
    ]),
    LoggerModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
