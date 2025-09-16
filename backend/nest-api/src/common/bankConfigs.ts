export const BANKS_CONFIG = [
  {
    name: 'PrivatBank',
    headers: ['Дата', 'Опис операції', 'Сума в валюті картки'],
    dateCol: 'Дата',
    descriptionCol: 'Опис операції',
    amountCol: 'Сума в валюті картки',
    hasHeaderRow: true, // PrivatBank має два рядки заголовків
  },
  {
    name: 'UkrSibbank',
    headers: ['Дата операції', 'Опис операції', 'Сума', 'Категорія'],
    dateCol: 'Дата операції',
    descriptionCol: 'Опис операції',
    amountCol: 'Сума',
    hasHeaderRow: false, // UkrSibbank має один рядок заголовків
  },
];
