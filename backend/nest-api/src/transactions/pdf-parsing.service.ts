import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PdfParsingService {
  async parsePdf(buffer: Buffer) {
    let data;
    try {
      // pdf-parse повертає Promise з об'єктом, що містить текст
      data = await pdfParse(buffer);
    } catch (error: any) {
      throw new InternalServerErrorException('PDF handling error.', error);
    }

    const fullText = data.text;

    return this.extractTransactionsFromText(fullText);
  }

  private extractTransactionsFromText(text: string) {
    const transactions: {
      date: Date;
      description: string;
      mcc: string;
      amount: number;
      type: 'expense' | 'income';
    }[] = [];
    const lines = text.split('\n');

    // Регулярний вираз для вилучення даних
    const transactionRegex =
      /(\d{2}\.\d{2}\.\d{4})\s*(\d{2}:\d{2}:\d{2})\s*(.+?)\s*(\d{4})\s*(-?\d+[\s,]\d{2})\s*(-?\d+[\s,]\d{2})\s*([A-Z]{3})/;

    for (const line of lines) {
      const match = line.match(transactionRegex);

      if (match) {
        const dateString = match[1];
        const timeString = match[2];
        const description = match[3].trim();
        const mcc = match[4];
        const amountString = match[5].replace(',', '.').replace(/\s/g, '');

        const transaction = {
          date: new Date(
            `${dateString.split('.').reverse().join('-')}T${timeString}Z`,
          ),
          description,
          mcc,
          amount: parseFloat(amountString),
          type: amountString.startsWith('-')
            ? 'expense'
            : ('income' as 'expense' | 'income'),
        };

        transactions.push(transaction);
      }
    }

    return transactions;
  }
}
