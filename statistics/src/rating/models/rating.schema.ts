import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class RatingDocument extends AbstractDocument {
  @Prop()
  customerId: string;

  @Prop()
  employeeId: string;

  @Prop()
  rate: number;

  @Prop()
  review: string;

  @Prop()
  created_at: Date;
}

export const RatingSchema = SchemaFactory.createForClass(RatingDocument);
