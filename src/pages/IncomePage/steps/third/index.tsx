import { Button, Card, Col, Input, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { utils, writeFile } from "xlsx";
import { getTableSplits } from "../../../../features/splitsTable/splitsTableSelector";
import { getFile } from "../../../../features/file/fileSelector";
import { InputUpload } from "../../../../components/input-upload";

interface IProps {
  prevStep: () => void;
}

export const ThirdStep: React.FC<IProps> = ({ prevStep }) => {
  const tableData = useSelector(getTableSplits);
  const fileData = useSelector(getFile);
  const [whs, setWhs] = useState([]);
  useEffect(() => {
    const tmp = [];
    const excludeKeys = ["barcode", "key", "status", "total"];
    Object.keys(tableData[0]).forEach((key) => {
      if (!excludeKeys.includes(key)) tmp.push(key);
      setWhs(tmp);
      // sum += Number(key);
    });
  }, []);

  const saveFile = (name: string): void => {
    const table = [];
    tableData.forEach((item) => {
      for (let index = 0; index < item[name] / 10; index++) {
        const el = fileData.find((e) => e.barcode === item.barcode);
        table.push([item.barcode, el?.longName, el?.providerId]);
      }
    });

    const nwb = utils.book_new();
    const nws = utils.aoa_to_sheet(table);
    utils.book_append_sheet(nwb, nws, "split");
    writeFile(nwb, name + ".xlsx");
  };

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        {whs.map((item) => {
          return (
            <Card title={item}>
              <Row
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <Button onClick={() => saveFile(item)}>Скачать шк</Button>
                <Button onClick={() => uploadTz(item)}>Скачать тз</Button>
              </Row>
            </Card>
          );
        })}
      </div>
      <Button onClick={prevStep}>Back</Button>
    </div>
  );
};
