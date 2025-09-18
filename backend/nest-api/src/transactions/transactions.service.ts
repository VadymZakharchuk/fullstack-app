// src/transactions/transactions.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { User } from '../users/user.entity';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.entity';
import { DocumentsService } from '../documents/documents.service';
import { TransactionCategorizationService } from './transaction-categorization.service';
import * as crypto from 'crypto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private categoriesService: CategoriesService,
    private readonly documentsService: DocumentsService,
    private readonly transactionCategorizationService: TransactionCategorizationService,
  ) {}

  private createTransactionFingerprint(
    transaction: CreateTransactionInput | Transaction,
    bankName: string,
  ): string {
    const data = `${transaction.date.toISOString()}|${transaction.amount}|${transaction.description}|${transaction.type}|${bankName}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async create(
    createTransactionInput: CreateTransactionInput,
    user: User,
  ): Promise<Transaction> {
    const { categoryId, documentId, bankName, ...restOfDto } =
      createTransactionInput;

    let category: Category | undefined;
    if (categoryId) {
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

    const fingerprint = this.createTransactionFingerprint(
      createTransactionInput,
      bankName,
    );

    const transaction = this.transactionsRepository.create({
      ...restOfDto,
      documentId,
      category,
      bankName,
      fingerprint,
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

  async createMany(
    createTransactionInputs: CreateTransactionInput[],
    documentId: string,
    bankName: string,
    user: User,
  ): Promise<Transaction[]> {
    // Крок 1: Генерація "відбитків" для нових транзакцій
    const newTransactionFingerprints = createTransactionInputs.map((input) =>
      this.createTransactionFingerprint(input, bankName),
    );

    // Крок 2: Пошук існуючих транзакцій з такими ж "відбитками" і назвою банку
    const existingTransactions = await this.transactionsRepository.find({
      where: {
        user: { id: user.id },
        bankName,
        fingerprint: In(newTransactionFingerprints),
      },
    });

    const existingFingerprints = new Set(
      existingTransactions.map((t) => t.fingerprint),
    );

    const uniqueTransactionsToSave = createTransactionInputs
      .filter((input) => {
        const fingerprint = this.createTransactionFingerprint(input, bankName);
        return !existingFingerprints.has(fingerprint);
      })
      .map((input) => {
        const transaction: Partial<Transaction> = {
          amount: input.amount,
          description: input.description,
          date: input.date,
          type: input.type,
          bankName: input.bankName,
          documentId: documentId,
          user: user,
          fingerprint: this.createTransactionFingerprint(input, bankName),
        };

        // Встановлюємо зв'язок з категорією, якщо categoryId існує
        if (input.categoryId) {
          transaction.category = { id: input.categoryId } as Category;
        }

        return this.transactionsRepository.create(transaction);
      });

    // Крок 4: Збереження лише унікальних транзакцій
    return this.transactionsRepository.save(uniqueTransactionsToSave);
  }
}
