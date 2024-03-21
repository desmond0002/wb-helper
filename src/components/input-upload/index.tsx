import { Button, Input, Space } from "antd";
import { useState } from "react";
import { InitFileType } from "../../types/types";
import { writeFile, utils } from "xlsx";

interface IProps {
  fileData: InitFileType[];
  tableData: any[];
}

export const InputUpload: React.FC<IProps> = ({ fileData, tableData }) => {
  const [value, setValue] = useState("");

  const uploadTz = (whName: string): void => {
    const result = [];
    const firstBlock = [];
    const secondResult = [];

    fileData.forEach((row) => {
      const splitedBarcode = tableData.find((e) => e.barcode === row.barcode);
      if (row.barcode && splitedBarcode) {
        const str = row.longName;
        const idx = str.lastIndexOf(",");
        const name = str.slice(0, idx);

        const existIdx = firstBlock.findIndex(
          (element) => element.name === name
        );
        if (existIdx > -1) {
          firstBlock[
            existIdx
          ].sizes += `${row.size} - ${splitedBarcode[whName]}\n`;
        } else {
          firstBlock.push({
            name: name,
            sizes: `${row.size} - ${splitedBarcode[whName]}\n`,
          });
        }
        secondResult.push([
          name,
          row.barcode,
          row.size,
          splitedBarcode[whName],
          row.article,
          row.brand,
          "",
          "20*11*6",
          row.country,
          "",
          "",
          "",
          "",
          "ИП Селуянов А.С",
        ]);
      }
    });
    firstBlock.forEach((item) =>
      result.push([item.name, item.sizes, "", "-Приемка на складе"])
    );

    // addToSheet(value, result, `${whName}!A7`);
    // addToSheet(value, secondResult, `${whName}!A${result.length + 14}`);

    const nwb = utils.book_new();
    const nws = utils.aoa_to_sheet([...result, ...secondResult]);
    utils.book_append_sheet(nwb, nws, "split");
    writeFile(nwb, whName + ".xlsx");
  };

  return (
    <Space.Compact>
      <Input
        placeholder="spreadsheetId"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Button type="primary" onClick={() => uploadTz(value)}>
        Отправить ТЗ
      </Button>
    </Space.Compact>
  );
};
