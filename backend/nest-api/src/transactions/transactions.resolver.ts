import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { DocumentsService } from '../documents/documents.service';
import { Document } from '../documents/document.schema';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { User } from '../users/user.entity';
import { GqlUser } from '../common/gql-user.decorator';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { XlsxParsingService } from './xlsx-parsing.service';

@Resolver(() => Transaction)
@UseGuards(GqlAuthGuard)
export class TransactionsResolver {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly documentsService: DocumentsService,
    private readonly xlsxParsingService: XlsxParsingService,
  ) {}

  @Query(() => [Transaction])
  async transactions(@GqlUser() user: User): Promise<Transaction[]> {
    return this.transactionsService.findAll(user);
  }

  @Query(() => Transaction)
  async transaction(
    @Args('id', { type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<Transaction> {
    const transaction = await this.transactionsService.findOne(id, user);
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found.`);
    }
    return transaction;
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
    @GqlUser() user: User,
  ): Promise<Transaction> {
    return this.transactionsService.create(createTransactionInput, user);
  }

  @Mutation(() => Transaction)
  async updateTransaction(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTransactionInput')
    updateTransactionInput: UpdateTransactionInput,
    @GqlUser() user: User,
  ): Promise<Transaction> {
    return await this.transactionsService.update(
      id,
      updateTransactionInput,
      user,
    );
  }

  @Mutation(() => ID)
  async removeTransaction(
    @Args('id', { type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<string> {
    await this.transactionsService.remove(id, user);
    return id;
  }

  @ResolveField(() => Document, { nullable: true })
  async document(
    @Parent() transaction: Transaction,
    @GqlUser() user: User,
  ): Promise<Document | null> {
    if (!transaction.documentId) {
      return null;
    }
    return this.documentsService.findOne(transaction.documentId, user);
  }

  @Mutation(() => [Transaction])
  async uploadTransactionsFromXlsx(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: FileUpload,
    @GqlUser() user: User,
  ): Promise<Transaction[]> {
    const { mimetype, filename } = file;
    const stream = file.createReadStream();

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (
      mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new Error(
        'Непідтримуваний формат файлу. Будь ласка, завантажте XLSX.',
      );
    }

    const createDocumentInput = {
      name: filename,
      fileName: filename,
      url: '',
      mimeType: mimetype,
      size: buffer.length,
      content: buffer.toString('base64'),
    };
    const document = await this.documentsService.create(
      createDocumentInput,
      user,
    );

    const { transactions, bankName } = await this.xlsxParsingService.parseXlsx(
      buffer,
      filename,
      user,
    );

    return await this.transactionsService.createMany(
      transactions.map((t) => ({ ...t, documentId: document.id, bankName })),
      document.id,
      bankName,
      user,
    );
  }
}
