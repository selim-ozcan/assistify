import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class ProductDocument extends AbstractDocument {
  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop()
  image: string;

  @Prop()
  shelf: string;

  @Prop()
  stock: string;

  @Prop()
  material: string;

  @Prop()
  type: string;

  @Prop()
  size: string;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
