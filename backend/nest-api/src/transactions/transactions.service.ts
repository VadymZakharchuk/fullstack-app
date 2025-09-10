import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.entity';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
    private readonly documentsService: DocumentsService,
  ) {}

  // Create a new transaction
  async create(
    createTransactionDto: CreateTransactionInput,
    user: User,
  ): Promise<Transaction> {
    let documentId: string | undefined = undefined;

    if (createTransactionDto.documentInput) {
      const document = await this.documentsService.create(
        createTransactionDto.documentInput,
      );
      documentId = document.id;
    }

    const { categoryId, ...restOfDto } = createTransactionDto;

    let category: Category | undefined;

    if (categoryId) {
      category = await this.categoriesService.findOne(+categoryId, user);
    }

    const transaction = this.transactionsRepository.create({
      ...restOfDto,
      documentId, // Додаємо documentId до транзакції
      category,
      user,
    });

    return this.transactionsRepository.save(transaction);
  }

  async findAll(user: User): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
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

    if (transaction.documentId) {
      await this.documentsService.remove(transaction.documentId);
    }

    await this.transactionsRepository.remove(transaction);
  }
}
