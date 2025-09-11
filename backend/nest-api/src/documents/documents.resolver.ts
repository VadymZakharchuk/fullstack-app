import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './document.schema';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlUser } from '../common/gql-user.decorator';
import { User } from '../users/user.entity';

@Resolver(() => Document)
@UseGuards(GqlAuthGuard)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Query(() => [Document])
  async documents(@GqlUser() user: User): Promise<Document[]> {
    return this.documentsService.findAll(user);
  }

  @Query(() => Document)
  async document(
    @Args('id', { type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<Document> {
    const document = await this.documentsService.findOne(id, user);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }
    return document;
  }

  @Mutation(() => Document)
  async createDocument(
    @Args('createDocumentInput') createDocumentInput: CreateDocumentInput,
    @GqlUser() user: User,
  ): Promise<Document> {
    return this.documentsService.create(createDocumentInput, user);
  }

  @Mutation(() => Document)
  async updateDocument(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateDocumentInput') updateDocumentInput: UpdateDocumentInput,
    @GqlUser() user: User,
  ): Promise<Document> {
    return await this.documentsService.update(id, updateDocumentInput, user);
  }

  @Mutation(() => ID)
  async removeDocument(
    @Args('id', { type: () => ID }) id: string,
    @GqlUser() user: User,
  ): Promise<string> {
    const removed = await this.documentsService.remove(id, user);
    if (!removed) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }
    return id;
  }
}
