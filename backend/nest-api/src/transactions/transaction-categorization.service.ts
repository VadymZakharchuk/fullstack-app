// src/transactions/transaction-categorization.service.ts
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
  ) {
    const categories = await this.categoryRepository.find();
    // Логіка для категорій
    for (const category of categories) {
      if (
        transactionDto.description
          .toLowerCase()
          .includes(category.name.toLowerCase())
      ) {
        transactionDto.categoryId = category.id;
        break;
      }
    }
    return transactionDto;
  }
}
