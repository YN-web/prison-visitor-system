import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @Length(16, 16)
  nationalId: string;

  @IsString()
  @Length(9, 9)
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}