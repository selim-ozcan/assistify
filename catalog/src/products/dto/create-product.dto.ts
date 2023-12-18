import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  price: number;

  @IsString()
  shelf: string;

  @IsString()
  material: string;

  @IsString()
  type: string;

  @IsArray()
  images: string[];

  @IsArray()
  sizes: string[];

  @IsArray()
  colors: string[];

  @IsArray()
  stocks: any[];
}
