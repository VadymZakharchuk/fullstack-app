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
    const transactions = [];

    // Регулярний вираз для захоплення блоку транзакції.
    // Він починається з дати, часу і захоплює весь текст до наступної дати або до кінця рядка.
    const transactionBlockRegex =
      /(\d{2}\.\d{2}\.\d{4})\s*(\d{2}:\d{2}:\d{2})\s*([\s\S]+?)(?=\d{2}\.\d{2}\.\d{4}|Z)/g;

    let match;
    while ((match = transactionBlockRegex.exec(text)) !== null) {
      const dateString = match[1];
      const timeString = match[2];
      const blockContent = match[3];

      // Другий регулярний вираз для детального парсингу вмісту блоку.
      // Він шукає опис, MCC та суми, ігноруючи переноси рядків.
      const blockDetailsRegex =
        /^(.*?)\s*(\d{4})?\s*(-?\d{1,3}(?:\s\d{3})*[\s,]\d{2})\s*(-?\d{1,3}(?:\s\d{3})*[\s,]\d{2})\s*([A-Z]{3})/m;

      const blockMatch = blockContent.match(blockDetailsRegex);
      console.log(match);
      if (blockMatch) {
        const description = blockMatch[1].trim();
        const mcc = blockMatch[2] || '';
        const amountString = blockMatch[3].replace(',', '.').replace(/\s/g, '');

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
    console.log(transactions);
    return []; // transactions;
  }
}
