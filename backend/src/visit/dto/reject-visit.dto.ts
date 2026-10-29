import { IsNotEmpty, IsString } from 'class-validator';

export class RejectVisitDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}