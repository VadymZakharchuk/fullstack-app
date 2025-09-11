import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { User } from '../users/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.entity';
import { DocumentsService } from '../documents/documents.service';
import { TransactionCategorizationService } from './transaction-categorization.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
    private readonly documentsService: DocumentsService,
    private readonly transactionCategorizationService: TransactionCategorizationService,
  ) {}

  async create(
    createTransactionInput: CreateTransactionInput,
    user: User,
  ): Promise<Transaction> {
    const { categoryId, documentInput, ...restOfDto } = createTransactionInput;

    let documentId: string | undefined = undefined;
    if (documentInput) {
      const document = await this.documentsService.create(documentInput, user);
      documentId = document.id;
    }

    let category: Category | undefined;
    if (categoryId) {
      category = await this.categoriesService.findOne(+categoryId, user);
    } else {
      // Якщо категорія не надана, використовуємо сервіс для її визначення
      const categorizedDto =
        await this.transactionCategorizationService.assignCategoriesAndCounterParties(
          createTransactionInput,
        );
      if (categorizedDto.categoryId) {
        category = await this.categoriesService.findOne(
          +categorizedDto.categoryId,
          user,
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      ...restOfDto,
      documentId,
      category,
      user,
    });

    return this.transactionsRepository.save(transaction);
  }

  async findAll(user: User): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: user.id } },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found.`);
    }
    return transaction;
  }

  async update(
    id: string,
    updateTransactionInput: UpdateTransactionInput,
    user: User,
  ): Promise<Transaction> {
    const transaction = await this.findOne(id, user);
    Object.assign(transaction, updateTransactionInput);
    return this.transactionsRepository.save(transaction);
  }

  async remove(id: string, user: User): Promise<void> {
    const transaction = await this.findOne(id, user);
    await this.transactionsRepository.remove(transaction);
  }
}
