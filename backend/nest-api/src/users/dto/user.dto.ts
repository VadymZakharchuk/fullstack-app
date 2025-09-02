/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNumber, IsString, IsEmail } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
