import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionCategorizationService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async assignCategoriesAndCounterParties(
    transactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionDto> {
    const categories = await this.categoryRepository.find();
    const resultDto = { ...transactionDto }; // Створюємо новий об'єкт

    // Логіка для категорій
    for (const category of categories) {
      if (
        resultDto.description
          .toLowerCase()
          .includes(category.name.toLowerCase())
      ) {
        resultDto.categoryId = category.id;
        break;
      }
    }
    return resultDto;
  }
}
