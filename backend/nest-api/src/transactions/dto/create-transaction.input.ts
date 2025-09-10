// src/transactions/dto/create-transaction.input.ts
import { InputType, Field, Float } from '@nestjs/graphql';
import { CreateDocumentDto } from '../../documents/dto/create-document.dto';

@InputType()
export class CreateTransactionInput {
  @Field(() => Float)
  amount: number;

  @Field()
  description: string;

  @Field()
  date: Date;

  @Field()
  type: 'income' | 'expense';

  @Field({ nullable: true })
  categoryId?: number;

  @Field({ nullable: true })
  documentId?: string;

  @Field(() => CreateDocumentDto, { nullable: true })
  documentInput?: CreateDocumentDto;
}
