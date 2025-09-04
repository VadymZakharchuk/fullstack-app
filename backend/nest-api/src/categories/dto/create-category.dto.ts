import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'The name must be a string.' })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  name: string;
}
