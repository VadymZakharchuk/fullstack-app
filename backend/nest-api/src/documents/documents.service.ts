import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from './document.schema';
import { CreateDocumentInput } from './dto/create-document.input';
import { User } from '../users/user.entity';
import { UpdateDocumentInput } from './dto/update-document.input';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document.name) private readonly documentModel: Model<Document>,
  ) {}

  async create(
    createDocumentInput: CreateDocumentInput,
    user: User,
  ): Promise<Document> {
    const newDocument = new this.documentModel({
      ...createDocumentInput,
      userId: user.id,
    });
    return newDocument.save();
  }

  async findAll(user: User): Promise<Document[]> {
    return this.documentModel.find({ userId: user.id }).exec();
  }

  async findOne(id: string, user: User): Promise<Document | null> {
    return this.documentModel.findOne({ _id: id, userId: user.id }).exec();
  }

  async update(
    id: string,
    updateDocumentInput: UpdateDocumentInput,
    user: User,
  ): Promise<Document> {
    const updatedDocument = await this.documentModel
      .findOneAndUpdate({ _id: id, userId: user.id }, updateDocumentInput, {
        new: true,
      })
      .exec();

    if (!updatedDocument) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }

    return updatedDocument;
  }

  async remove(id: string, user: User): Promise<boolean> {
    const result = await this.documentModel
      .deleteOne({ _id: id, userId: user.id })
      .exec();
    return result.deletedCount > 0;
  }
}
