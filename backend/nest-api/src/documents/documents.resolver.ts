import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => Document, { name: 'createDocument' })
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentInput);
  }
}
