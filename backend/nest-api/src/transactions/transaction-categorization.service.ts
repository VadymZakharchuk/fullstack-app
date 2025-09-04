// src/transactions/transaction-categorization.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity';
import { CounterParty } from '../counter-parties/counter-party.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionCategorizationService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CounterParty)
    private counterPartyRepository: Repository<CounterParty>,
  ) {}

  async assignCategoriesAndCounterParties(
    transactionDto: CreateTransactionDto,
  ) {
    const categories = await this.categoryRepository.find();
    const counterParties = await this.counterPartyRepository.find();

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

    // Логіка для контрагентів
    for (const counterParty of counterParties) {
      if (
        transactionDto.description
          .toLowerCase()
          .includes(counterParty.name.toLowerCase())
      ) {
        transactionDto.counterPartyId = counterParty.id;
        break;
      }
    }

    return transactionDto;
  }
}
