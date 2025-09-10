// src/transactions/transactions.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { DocumentsService } from '../documents/documents.service';
import { Document } from '../documents/document.schema';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { User } from 'src/users/user.entity';
import { GqlUser } from '../common/gql-user.decorator';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly documentsService: DocumentsService,
  ) {}

  @Query(() => [Transaction])
  async transactions(@GqlUser() user: User): Promise<Transaction[]> {
    return this.transactionsService.findAll(user);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
    @GqlUser() user: User,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionInput, user);
  }

  @ResolveField(() => Document, { nullable: true })
  async document(@Parent() transaction: Transaction): Promise<Document | null> {
    if (!transaction.documentId) {
      return null;
    }
    return this.documentsService.findOne(transaction.documentId);
  }
}
