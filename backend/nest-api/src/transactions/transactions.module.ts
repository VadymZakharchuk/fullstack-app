import { forwardRef, Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { PdfParsingService } from './pdf-parsing.service';
import { TransactionCategorizationService } from './transaction-categorization.service';
import { CategoriesService } from '../categories/categories.service';
import { Category } from '../categories/category.entity';
import { DocumentsModule } from '../documents/documents.module';
import { TransactionsResolver } from './transactions.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category]),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    DocumentsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PdfParsingService,
    TransactionCategorizationService,
    CategoriesService,
    TransactionsResolver,
  ],
})
export class TransactionsModule {}
