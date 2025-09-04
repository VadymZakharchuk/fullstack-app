// src/counter-parties/dto/create-counter-party.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateCounterPartyDto {
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  name: string;

  @IsString({ message: 'The address must be a string.' })
  @IsOptional()
  address?: string;

  @IsEmail({}, { message: 'The email must be a valid email address.' })
  @IsOptional()
  eMail?: string;

  @IsString({ message: 'The phone must be a string.' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'The person must be a string.' })
  @IsOptional()
  person?: string;

  @IsOptional()
  messengers?: {
    whatsApp?: string;
    telegram?: string;
    viber?: string;
  };
}
