import { IsNotEmpty, IsString } from 'class-validator';

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
}
