import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'companies', 'freelancer', 'jobSeeker']) 
  role?: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  verificationCode?: string;
}