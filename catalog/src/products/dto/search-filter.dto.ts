import { IsString } from 'class-validator';

export class SearchFilterDto {
  @IsString()
  material: string;

  @IsString()
  size: string;

  @IsString()
  color: string;
}
