/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Введіть дійсну електронну пошту.' })
  email: string;

  @IsString({ message: 'Пароль має бути рядком.' })
  @MinLength(6, { message: 'Пароль має бути не менше 6 символів.' })
  password: string;
}
