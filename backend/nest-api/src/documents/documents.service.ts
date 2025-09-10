// src/documents/documents.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from './document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
  ) {}

  async create(createDocumentInput: CreateDocumentDto): Promise<Document> {
    const newDocument = new this.documentModel(createDocumentInput);
    return newDocument.save();
  }

  async findOne(id: string): Promise<Document | null> {
    return this.documentModel.findById(id).exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.documentModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
