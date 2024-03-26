import { Button, Card, InputNumber, Row } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getSalesData } from "../../features/salesData/salesDataSelector";
import { getFile } from "../../features/file/fileSelector";
import { utils, writeFile } from "xlsx";

export const SalesPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>(14);
  const salesData = useSelector(getSalesData);
  const fileData = useSelector(getFile);

  const calcSalesPlus = () => {
    const resultRow: any[] = [];

    fileData.forEach((fileRow) => {
      let barcodeSum = 0;
      let shtSum = 0;
      salesData.forEach((dataRow) => {
        if (
          fileRow.barcode === dataRow.barcode &&
          dataRow.barcode &&
          fileRow.barcode
        ) {
          barcodeSum += dataRow.current;
          shtSum += dataRow.sht;
        }
      });
      if (shtSum === 0) resultRow.push([]);
      else {
        const g =
          Number(fileRow.Заказано) > 0
            ? barcodeSum + Number(fileRow.Заказано)
            : barcodeSum;
        resultRow.push([
          shtSum,
          g,
          (shtSum / inputValue).toFixed(0),
          barcodeSum / (shtSum / inputValue) > 0 ? g : 0,
        ]);
      }
    });
    const nwb = utils.book_new();
    const nws = utils.aoa_to_sheet(resultRow);

    utils.book_append_sheet(nwb, nws, "продажи");
    writeFile(nwb, "продажи с остатками.xlsx");
  };
  const calcSales = () => {
    const resultRow: any[] = [];

    fileData.forEach((fileRow) => {
      let barcodeSum = 0;
      let shtSum = 0;
      salesData.forEach((dataRow) => {
        if (
          fileRow.barcode === dataRow.barcode &&
          dataRow.barcode &&
          fileRow.barcode
        ) {
          barcodeSum += dataRow.current;
          shtSum += dataRow.sht;
        }
      });
      if (shtSum === 0) resultRow.push([]);
      else
        resultRow.push([
          shtSum,
          barcodeSum,
          (shtSum / inputValue).toFixed(0),
          (barcodeSum / (shtSum / inputValue)).toFixed(0),
        ]);
    });
    const nwb = utils.book_new();
    const nws = utils.aoa_to_sheet(resultRow);

    utils.book_append_sheet(nwb, nws, "продажи");
    writeFile(nwb, "продажи.xlsx");
  };
  return (
    <>
      {fileData.length > 0 && (
        <Card>
          <Row style={{ gap: "12px" }}>
            <>Число дней</>
            <InputNumber
              min={1}
              max={100}
              value={inputValue}
              onChange={(e) => setInputValue(Number(e))}
            />
            <Button onClick={calcSales}>Скачать файл продаж</Button>
            <Button onClick={calcSalesPlus}>
              Скачать файл продаж с прибавлением остатков
            </Button>
          </Row>
        </Card>
      )}
    </>
  );
};
