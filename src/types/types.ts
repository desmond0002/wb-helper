import { WorkSheet } from "xlsx";

export type InitFileType = {
  article: string;
  barcode: string;
  color: string;
  size: string;
  "Сумма по полю шт.": string;
  "Сумма по полю Текущий остаток, шт.": string;
  "средние заказы в день": string;
  "на сколько дней хватит": string;
  "Будет заказано": string;
  Заказано: string;
  Цена: string;
  quantity: string;
  price: string;
  providerId: string;
  brand: string;
  country: string;
};
export type DataSet = { [index: string]: WorkSheet; };