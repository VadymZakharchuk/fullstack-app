import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { Transaction } from './transaction.entity';
import { PdfParsingService } from './pdf-parsing.service';
import { TransactionCategorizationService } from './transaction-categorization.service';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { DocumentsModule } from '../documents/documents.module';
import { Category } from '../categories/category.entity';
import { memoryStorage, StorageEngine } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category]),
    MulterModule.register({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      storage: memoryStorage() as StorageEngine,
    }),
    forwardRef(() => UsersModule),
    CategoriesModule,
    DocumentsModule,
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PdfParsingService,
    TransactionCategorizationService,
    TransactionsResolver,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
