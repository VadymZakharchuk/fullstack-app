import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfParsingService } from './pdf-parsing.service';
import { DocumentsService } from '../documents/documents.service';
import { TransactionsService } from './transactions.service';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly pdfParsingService: PdfParsingService,
    private readonly documentsService: DocumentsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Файл відсутній або пошкоджений');
    }
    const user: User = req.user;

    // 1. Створення об'єкта CreateDocumentInput з даних файлу
    const createDocumentInput = {
      name: file.originalname,
      fileName: file.originalname,
      url: '',
      mimeType: file.mimetype,
      size: file.size,
      content: file.buffer.toString('base64'),
    };

    const document = await this.documentsService.create(
      createDocumentInput,
      user,
    );

    // 3. Парсинг транзакцій з буфера файлу
    const transactions = await this.pdfParsingService.parsePdf(file.buffer);

    // 4. Збереження транзакцій у БД
    // const savedTransactions = await this.transactionsService.createMany(
    //   transactions,
    //   document.id,
    //   user,
    // );

    // return {
    //   message: `Успішно імпортовано ${savedTransactions.length} транзакцій.`,
    //   count: savedTransactions.length,
    //   documentId: document.id,
    // };
    return {
      count: transactions.length,
      documentId: document.id,
    };
  }
}
