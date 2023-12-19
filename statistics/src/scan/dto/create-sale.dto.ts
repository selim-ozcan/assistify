import { IsString } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  customerId: string;

  @IsString()
  customerEmail: string;

  @IsString()
  productId: string;
}
