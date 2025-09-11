import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PdfParsingService {
  async parsePdf(buffer: Buffer): Promise<CreateTransactionDto[]> {
    let data;
    try {
      data = await pdfParse(buffer);
    } catch (error: any) {
      throw new InternalServerErrorException('PDF handling error.', error);
    }

    const fullText = data.text;
    return this.extractTransactionsFromText(fullText);
  }

  private extractTransactionsFromText(text: string): CreateTransactionDto[] {
    const transactions: CreateTransactionDto[] = [];
    const lines = text.split('\n');

    // Регулярний вираз для однієї лінії транзакції
    const transactionRegex =
      /^(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2}:\d{2})\s+([^\d]+?)\s+(-?\d{1,3}(?:\s\d{3})*,\d{2})\s+([A-Z]{3})$/;

    for (const line of lines) {
      const match = line.trim().match(transactionRegex);
      if (match) {
        const [, dateString, timeString, description, amountString] = match;

        // Парсинг дати
        const date = new Date(
          `${dateString.split('.').reverse().join('-')}T${timeString}`,
        );

        // Парсинг суми та типу
        const amount = parseFloat(
          amountString.replace(/\s/g, '').replace(',', '.'),
        );
        const type = amount >= 0 ? 'income' : 'expense';

        // Формування DTO
        const transactionDto: CreateTransactionDto = {
          date,
          description: description.trim(),
          amount: Math.abs(amount),
          type,
        };

        transactions.push(transactionDto);
      }
    }

    return transactions;
  }
}
