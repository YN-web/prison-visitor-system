import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVisitDto {
  @IsUUID()
  inmateId: string;

  @IsDateString()
  visitDate: string;

  @IsOptional()
  @IsUUID()
  slotId?: string;

  @IsOptional()
  @IsString()
  purpose?: string;
}