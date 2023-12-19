import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class SaleDocument extends AbstractDocument {
  @Prop()
  customerId: string;

  @Prop()
  customerEmail: string;

  @Prop()
  productId: string;

  @Prop()
  created_at: Date;
}

export const SaleSchema = SchemaFactory.createForClass(SaleDocument);
