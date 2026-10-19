import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrisonDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;
}