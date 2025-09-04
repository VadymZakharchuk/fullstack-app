import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { CounterPartiesService } from '../counter-parties/counter-parties.service';
import { CounterParty } from '../counter-parties/counter-party.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
    private counterPartiesService: CounterPartiesService,
  ) {}

  // Create a new transaction
  async create(
    createTransactionDto: CreateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const { categoryId, counterPartyId, ...restOfDto } = createTransactionDto;

    let category: Category | undefined;
    let counterParty: CounterParty | undefined;

    // Перевіряємо, чи є categoryId, перш ніж шукати категорію
    if (categoryId) {
      category = await this.categoriesService.findOne(categoryId, user);
    }

    // Перевіряємо, чи є counterPartyId, перш ніж шукати контрагента
    if (counterPartyId) {
      counterParty = await this.counterPartiesService.findOne(
        counterPartyId,
        user,
      );
    }

    const transaction = this.transactionsRepository.create({
      ...restOfDto,
      category,
      counterParty,
      user,
    });

    return this.transactionsRepository.save(transaction);
  }

  // Get all transactions for the current user
  async findAll(user: User): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'DESC' },
    });
  }

  // Find a single transaction by ID and user
  async findOne(id: string, user: User): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found.`);
    }
    return transaction;
  }

  // Update a transaction
  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, user);
    Object.assign(transaction, updateTransactionDto);
    return this.transactionsRepository.save(transaction);
  }

  // Delete a transaction
  async remove(id: string, user: User): Promise<void> {
    const transaction = await this.findOne(id, user);
    await this.transactionsRepository.remove(transaction);
  }
}
