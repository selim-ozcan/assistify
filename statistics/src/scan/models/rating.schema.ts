import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class ScanDocument extends AbstractDocument {
  @Prop()
  customerId: string;

  @Prop()
  productId: string;

  @Prop()
  productType: string;

  @Prop()
  productMaterial: string;

  @Prop()
  productPrice: number;

  @Prop()
  created_at: Date;
}

export const RatingSchema = SchemaFactory.createForClass(ScanDocument);
