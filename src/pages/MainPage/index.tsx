import { Input, Table } from "antd";
import { InitFileType } from "../../types/types";
import React from "react";
import { ColumnsType } from "antd/es/table";
import { useDispatch, useSelector } from "react-redux";
import { getFile } from "../../features/file/fileSelector";
import { read, utils } from "xlsx";
import { FileActions } from "../../features/file/fileSlice";

const columns: ColumnsType<InitFileType> = [
  {
    key: "article",
    title: "Артикул",
    dataIndex: "article",
  },
  {
    key: "barcode",
    title: "Баркод",
    dataIndex: "barcode",
  },
  {
    key: "color",
    title: "цвет",
    dataIndex: "color",
  },
  {
    key: "article",
    title: "NameTitle",
    dataIndex: "name",
  },
  {
    key: "size",
    title: "Размер",
    dataIndex: "size",
  },
  {
    key: "Сумма по полю шт.",
    title: "Сумма по полю шт.",
    dataIndex: "Сумма по полю шт.",
  },
  {
    key: "Сумма по полю Текущий остаток, шт.",
    title: "Сумма по полю Текущий остаток, шт.",
    dataIndex: "Сумма по полю Текущий остаток, шт.",
  },
  {
    key: "средние заказы в день",
    title: "средние заказы в день",
    dataIndex: "средние заказы в день",
  },
  {
    key: "на сколько дней хватит",
    title: "на сколько дней хватит",
    dataIndex: "на сколько дней хватит",
  },
  {
    key: "Будет заказано",
    title: "Будет заказано",
    dataIndex: "Будет заказано",
  },
  {
    key: "Заказано",
    title: "Заказано",
    dataIndex: "Заказано",
  },
  {
    key: "article",
    title: "NameTitle",
    dataIndex: "name",
  },
  {
    key: "Цена",
    title: "Цена",
    dataIndex: "Цена",
  },
  {
    key: "quantity",
    title: "Количество",
    dataIndex: "quantity",
  },
  {
    key: "price",
    title: "Цена (заказано)",
    dataIndex: "price",
  },
  {
    key: "providerId",
    title: "Аритикул поставщика",
    dataIndex: "providerId",
  },
];

export const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const fileData = useSelector(getFile);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (e: any) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (data) {
          const workbook = read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = utils.sheet_to_json(sheet);
          // setData(parsedData);
          dispatch(FileActions.setFile(parsedData));
          console.log(parsedData);
        }
      } catch (error) {
        alert(error);
      }
    };
  };

  return (
    <>
      {fileData.length != 0 ? (
        <Table<InitFileType> dataSource={fileData} columns={columns} />
      ) : (
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      )}
    </>
  );
};
