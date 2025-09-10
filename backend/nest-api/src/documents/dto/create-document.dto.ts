// src/documents/dto/create-document.dto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDocumentDto {
  @Field()
  fileName: string;

  @Field()
  url: string;

  @Field()
  content: string;
}
