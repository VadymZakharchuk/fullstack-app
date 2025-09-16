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
import { DocumentsService } from '../documents/documents.service';
import { TransactionsService } from './transactions.service';
import { XlsxParsingService } from './xlsx-parsing.service';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateTransactionDto } from './dto/create-transaction.dto';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly xlsxParsingService: XlsxParsingService,
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

    // Крок 1: Перевірка типу файлу
    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      throw new BadRequestException(
        'Непідтримуваний формат файлу. Будь ласка, завантажте XLSX.',
      );
    }

    const user: User = req.user;

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

    const transactions: CreateTransactionDto[] =
      await this.xlsxParsingService.parseXlsx(file.buffer, file.originalname);

    const savedTransactions = await Promise.all(
      transactions.map((transactionData) =>
        this.transactionsService.create(
          { ...transactionData, documentId: document.id },
          user,
        ),
      ),
    );

    return {
      message: `Успішно імпортовано ${savedTransactions.length} транзакцій.`,
      count: savedTransactions.length,
      documentId: document.id,
    };
  }
}
