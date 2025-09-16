// src/transactions/xlsx-parsing.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Workbook, Cell, CellValue, Worksheet } from 'exceljs';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Readable } from 'stream';
import { BANKS_CONFIG } from '../common/bankConfigs';

@Injectable()
export class XlsxParsingService {
  async parseXlsx(
    buffer: Buffer,
    fileName: string,
  ): Promise<CreateTransactionDto[]> {
    try {
      const workbook = new Workbook();
      const stream = Readable.from(buffer);
      await workbook.xlsx.read(stream);

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        throw new InternalServerErrorException('XLSX файл не містить листів.');
      }

      // 1. Визначення конфігурації за назвою файлу
      const bankConfig = BANKS_CONFIG.find((config) =>
        fileName
          .toLowerCase()
          .includes(config.name.toLowerCase().replace('bank', '')),
      );

      if (!bankConfig) {
        throw new InternalServerErrorException(
          'Не вдалося розпізнати банк за назвою файлу. Назва має містити назву банку, наприклад "Privat" або "UkrSib".',
        );
      }

      // 2. Отримання рядка заголовків
      const headerRow = worksheet.getRow(bankConfig.hasHeaderRow ? 2 : 1);
      let headerValues: string[] = [];
      if (headerRow && Array.isArray(headerRow.values)) {
        headerValues = headerRow.values
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter(Boolean);
      } else {
        throw new InternalServerErrorException(
          'Не вдалося знайти рядок заголовків або він має некоректний формат.',
        );
      }

      if (headerValues.length === 0) {
        throw new InternalServerErrorException('Рядок заголовків порожній.');
      }

      // 3. Отримання індексів стовпців за їх назвами
      const colIndices = {
        date: headerValues.indexOf(bankConfig.dateCol),
        description: headerValues.indexOf(bankConfig.descriptionCol),
        amount: headerValues.indexOf(bankConfig.amountCol),
      };

      if (Object.values(colIndices).some((index) => index === -1)) {
        throw new InternalServerErrorException(
          "Не всі обов'язкові стовпці знайдено.",
        );
      }

      // 4. Обробка рядків з транзакціями
      const transactions: CreateTransactionDto[] = [];
      const startRow = bankConfig.hasHeaderRow ? 3 : 2;
      for (let i = startRow; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const dateCell = row.getCell(colIndices.date + 1);
        const descriptionCell = row.getCell(colIndices.description + 1);
        const amountCell = row.getCell(colIndices.amount + 1);

        if (dateCell.value && descriptionCell.value && amountCell.value) {
          const date = this.parseDateFromCell(dateCell);
          const description = this.parseStringFromCell(descriptionCell.value);
          const amount = this.parseAmountFromCell(amountCell.value);

          const type = amount >= 0 ? 'income' : 'expense';

          const transactionDto: CreateTransactionDto = {
            date,
            description,
            amount,
            type,
          };
          transactions.push(transactionDto);
        }
      }

      return transactions;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Помилка обробки XLSX: ${error.message}`,
      );
    }
  }

  private parseDateFromCell(cell: Cell): Date {
    // Якщо значення вже є об'єктом Date, повертаємо його
    if (cell.value instanceof Date) {
      // Excel-js іноді повертає Date з некоректною часовою зоною,
      // тому краще перетворити його в UTC.
      return new Date(
        Date.UTC(
          cell.value.getFullYear(),
          cell.value.getMonth(),
          cell.value.getDate(),
          cell.value.getHours(),
          cell.value.getMinutes(),
          cell.value.getSeconds(),
        ),
      );
    }
    // Якщо значення є числовим, це може бути дата з часом
    else if (typeof cell.value === 'number') {
      // Числове значення в Excel - це кількість днів з 1899-12-30.
      // Десяткова частина - це час.
      const dateInMilliseconds = (cell.value - 25569) * 86400000;
      const date = new Date(dateInMilliseconds);

      if (isNaN(date.getTime())) {
        throw new InternalServerErrorException(
          'Некоректний числовий формат дати.',
        );
      }
      return date;
    }
    // Якщо значення є рядком, парсимо його з урахуванням часу
    else if (typeof cell.value === 'string') {
      const dateRegex = /(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2}:\d{2})/;
      const match = cell.value.match(dateRegex);

      if (match) {
        const [, dateString, timeString] = match;
        const [day, month, year] = dateString.split('.');

        const date = new Date(
          Date.UTC(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            ...timeString.split(':').map(Number),
          ),
        );

        if (isNaN(date.getTime())) {
          throw new InternalServerErrorException(
            'Некоректний рядковий формат дати.',
          );
        }
        return date;
      }
    }
    throw new InternalServerErrorException(
      'Непідтримуваний формат дати в комірці.',
    );
  }

  private parseStringFromCell(cellValue: CellValue): string {
    if (typeof cellValue === 'string') {
      return cellValue;
    }
    throw new InternalServerErrorException(
      'Некоректний формат текстового поля.',
    );
  }

  private parseAmountFromCell(cellValue: CellValue): number {
    if (typeof cellValue === 'number') {
      return cellValue;
    } else if (typeof cellValue === 'string') {
      const cleanedString = cellValue.replace(/\s/g, '').replace(',', '.');
      const amount = parseFloat(cleanedString);
      if (isNaN(amount)) {
        throw new InternalServerErrorException('Некоректний формат суми.');
      }
      return amount;
    }
    throw new InternalServerErrorException('Непідтримуваний формат суми.');
  }
}
