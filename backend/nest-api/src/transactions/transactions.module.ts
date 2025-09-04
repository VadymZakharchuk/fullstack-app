import { forwardRef, Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UsersModule } from '../users/users.module';
import { CounterPartiesModule } from '../counter-parties/counter-parties.module';
import { PdfParsingService } from './pdf-parsing.service';
import { TransactionCategorizationService } from './transaction-categorization.service';
import { CategoriesService } from '../categories/categories.service';
import { CounterPartiesService } from '../counter-parties/counter-parties.service';
import { Category } from '../categories/category.entity';
import { CounterParty } from '../counter-parties/counter-party.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Category, CounterParty]),
    forwardRef(() => UsersModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CounterPartiesModule),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PdfParsingService,
    TransactionCategorizationService,
    CategoriesService,
    CounterPartiesService,
  ],
})
export class TransactionsModule {}
