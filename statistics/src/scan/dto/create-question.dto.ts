import { IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  customerId: string;

  @IsString()
  customerEmail: string;

  @IsString()
  productId: string;

  @IsString()
  question: string;
}
