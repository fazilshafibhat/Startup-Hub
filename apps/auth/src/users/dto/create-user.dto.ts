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

  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true })
  // @IsNotEmpty({ each: true })
  // roles?: string[];

  // @IsOptional()
  // @IsString()
  // @IsNotEmpty()
  // role?: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'companies', 'freelancer', 'jobSeeker']) // Add enum validation
  role?: string;

  @IsBoolean()
  @IsOptional()
  verified: boolean; // Make this required

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  verificationCode?: string;
}