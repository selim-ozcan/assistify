import { IsNotEmpty, IsString } from 'class-validator';

export class HelpComingDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;
}
