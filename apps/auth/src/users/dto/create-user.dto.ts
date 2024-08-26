import {
  IsArray,
  IsBoolean,
  IsEmail,
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
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: string[];

  @IsBoolean()
  @IsOptional()
  verified: boolean; // Make this required

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  verificationCode?: string;
}