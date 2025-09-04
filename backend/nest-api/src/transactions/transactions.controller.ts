import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { User } from '../users/user.entity';
import { GetUser } from '../common/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PdfParsingService } from './pdf-parsing.service';
import { TransactionCategorizationService } from './transaction-categorization.service';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly pdfParsingService: PdfParsingService,
    private readonly transactionCategorizationService: TransactionCategorizationService,
  ) {}

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.create(createTransactionDto, user);
  }

  @Get()
  async findAll(@GetUser() user: User) {
    return this.transactionsService.findAll(user);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return this.transactionsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: User,
  ) {
    return this.transactionsService.update(id, updateTransactionDto, user);
  }

  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return this.transactionsService.remove(id, user);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    let parsedTransactions;

    if (file.mimetype === 'application/pdf') {
      parsedTransactions = await this.pdfParsingService.parsePdf(file.buffer);
    } else {
      throw new BadRequestException(
        'Непідтримуваний формат файлу. Будь ласка, завантажте PDF.',
      );
    }

    const savedTransactions = [];
    if (parsedTransactions && parsedTransactions.length > 0) {
      for (const transactionData of parsedTransactions) {
        // Зберігаємо кожну транзакцію в базу даних
        const categorizedTransaction =
          await this.transactionCategorizationService.assignCategoriesAndCounterParties(
            transactionData,
          );
        const createdTransaction = await this.transactionsService.create(
          categorizedTransaction,
          user,
        );
        savedTransactions.push(createdTransaction);
      }
    } else {
      return {
        message: 'File handled but transactions are missed.',
        count: 0,
      };
    }

    return {
      message: 'All transactions have been imported',
      count: savedTransactions.length,
    };
  }
}
