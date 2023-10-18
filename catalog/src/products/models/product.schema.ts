import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class ProductDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  color: string;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
