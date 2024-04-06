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
  longName: string;
};
export type DataSet = { [index: string]: WorkSheet };

export type SplitType = {
  name: string;
  divider: number;
};

export type WarehousesType<T> = {
  "Чехов 1"?: T;
  "СГТ Внуково"?: T;
  Обухово?: T;
  Иваново?: T;
  "Подольск 3"?: T;
  "Рязань (Тюшевское)"?: T;
  Клин?: T;
  Тула?: T;
  Пушкино?: T;
  "Радумля 1"?: T;
  "Радумля СГТ"?: T;
  Электросталь?: T;
  Вёшки?: T;
  "Подольск 4"?: T;
  "Белая дача"?: T;
  Коледино?: T;
  "Чехов 2"?: T;
  Подольск?: T;
  "Белые Столбы"?: T;
  "СЦ Байсерке"?: T;
  Астана?: T;
  Атакент?: T;
  "СЦ Хабаровск"?: T;
  Хабаровск?: T;
  "СЦ Кузнецк"?: T;
  Казань?: T;
  "Екатеринбург - Испытателей 14г"?: T;
  "Екатеринбург - Перспективный 12"?: T;
  Минск?: T;
  Новосибирск?: T;
  Крыловское?: T;
  Краснодар?: T;
  Невинномысск?: T;
};

export type SalesDataType = {
  brand: string;
  article: string;
  barcode: string;
  size: string;
  sht: number;
  current: number;
};

export interface IOrders {
  date: string,
  lastChangeDate: string,
  warehouseName: string,
  countryName: string,
  oblastOkrugName: string,
  regionName: string,
  supplierArticle: string,
  nmId: number,
  barcode: string,
  category: string,
  subject: string,
  brand: string,
  techSize: string,
  incomeID: number,
  isSupply: boolean,
  isRealization: boolean,
  totalPrice: number,
  discountPercent: number,
  spp: number,
  finishedPrice: number,
  priceWithDisc: number,
  isCancel: boolean,
  orderType: string,
  sticker: string,
  gNumber: string,
  srid: string
  cancelDate: string,
}
