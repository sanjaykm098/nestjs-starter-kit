import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(20)
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
