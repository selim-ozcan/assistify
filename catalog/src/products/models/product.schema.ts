import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class ProductDocument extends AbstractDocument {
  @Prop()
  price: number;

  @Prop()
  shelf: string;

  @Prop()
  material: string;

  @Prop()
  type: string;

  @Prop()
  images: string[];

  @Prop()
  sizes: string[];

  @Prop()
  colors: string[];

  @Prop()
  stocks: number[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
