import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@soassistify/common';

@Schema()
export class QuestionDocument extends AbstractDocument {
  @Prop()
  customerId: string;

  @Prop()
  customerEmail: string;

  @Prop()
  productId: string;

  @Prop()
  question: string;

  @Prop()
  created_at: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionDocument);
