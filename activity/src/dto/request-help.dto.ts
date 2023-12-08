import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Product } from 'src/models/product.model';

export class RequestHelpDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  shelf: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  quickQuestion: string;

  @IsOptional()
  product: Product;
}
