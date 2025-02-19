import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HelpComingDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  shelf: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsOptional()
  quickAnswer: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
