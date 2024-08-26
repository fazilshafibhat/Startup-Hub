import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 5)
  otp: string;
}
