import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'The amount must be a number.' })
  @IsNotEmpty({ message: 'The amount cannot be empty.' })
  amount: number;

  @IsString({ message: 'The description must be a string.' })
  @IsNotEmpty({ message: 'The description cannot be empty.' })
  description: string;

  @IsNumber({}, { message: 'The category ID must be a number.' })
  @IsNotEmpty({ message: 'The category ID cannot be empty.' })
  categoryId?: number;

  @IsDateString({}, { message: 'The date must be a valid ISO 8601 string.' })
  @IsNotEmpty({ message: 'The date cannot be empty.' })
  date: Date;

  @IsEnum(['income', 'expense'], {
    message: 'Type must be either "income" or "expense".',
  })
  @IsNotEmpty({ message: 'The type cannot be empty.' })
  type: 'income' | 'expense';

  @IsString({ message: 'The description must be a string.' })
  bankName?: string;
}
