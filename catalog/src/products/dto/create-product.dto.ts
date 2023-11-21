import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  color: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsString()
  shelf: string;

  @IsNumber()
  stock: string;

  @IsString()
  material: string;

  @IsString()
  type: string;

  @IsString()
  size: string;
}
