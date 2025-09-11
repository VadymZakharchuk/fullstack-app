import { forwardRef, Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, DocumentSchema } from './document.schema';
import { DocumentsResolver } from './documents.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  providers: [DocumentsService, DocumentsResolver],
  exports: [DocumentsService],
})
export class DocumentsModule {}
