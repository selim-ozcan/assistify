import { IsNumber, IsString } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  customerId: string;

  @IsString()
  employeeId: string;

  @IsNumber()
  rate: number;

  @IsString()
  review: string;
}
