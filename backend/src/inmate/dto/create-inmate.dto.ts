import {
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateInmateDto {
  @IsNotEmpty()
  @IsString()
  inmateNumber: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsUUID()
  prisonId: string;
}