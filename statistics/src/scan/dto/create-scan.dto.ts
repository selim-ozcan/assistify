import { IsString } from 'class-validator';

export class CreateScanDto {
  @IsString()
  customerId: string;

  @IsString()
  customerEmail: string;

  @IsString()
  productId: string;
}
