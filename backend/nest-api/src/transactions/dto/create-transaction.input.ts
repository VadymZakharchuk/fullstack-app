// src/transactions/dto/create-transaction.input.ts
import { InputType, Field, Float } from '@nestjs/graphql';
import { CreateDocumentInput } from '../../documents/dto/create-document.input';

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

  @Field(() => CreateDocumentInput, { nullable: true })
  documentInput?: CreateDocumentInput;
}
