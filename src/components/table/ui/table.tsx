import React, { useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DataSet, InitFileType } from "../../../types/types";
import { read, utils, WorkSheet, writeFile } from "xlsx";

interface User {
  key: number;
  name: string;
}

const columns: ColumnsType<User> = [
  {
    key: "name",
    title: "NameTitle",
    dataIndex: "name",
  },
];

// const data: InitFileType[] = [
//   {
//     key: 0,
//     name: "Jack",
//   },
// ];

/* this method returns `rows` and `columns` data for sheet change */
const getRowsCols = (data: DataSet, sheetName: string) => ({
  rows: utils.sheet_to_json(data[sheetName], { header: 1 }),
});

const DataTable: React.FC = () => {
  const [data, setData] = useState<InitFileType[]>([]); // data rows
  const [workBook, setWorkBook] = useState<DataSet>({} as DataSet); // workbook
  const [sheets, setSheets] = useState<string[]>([]); // list of sheet names
  const [current, setCurrent] = useState<string>(""); // selected sheet

  /* called when sheet dropdown is changed */
  function selectSheet(name: string) {
    /* update workbook cache in case the current worksheet was changed */
    workBook[current] = utils.aoa_to_sheet(arrayify(rows));

    /* get data for desired sheet and update state */
    const { rows: new_rows } = getRowsCols(workBook, name);
    setData(new_rows);
    setCurrent(name);
  }

  /* this method handles refreshing the state with new workbook data */
  async function handleAB(file: ArrayBuffer): Promise<void> {
    /* read file data */
    const data = read(file);

    /* update workbook state */
    setWorkBook(data.Sheets);
    setSheets(data.SheetNames);

    /* select the first worksheet */
    const name = data.SheetNames[0];
    const { rows: new_rows, columns: new_columns } = getRowsCols(
      data.Sheets,
      name
    );
    setRows(new_rows);
    setColumns(new_columns);
    setCurrent(name);
  }

  /* called when file input element is used to select a new file */
  async function handleFile(ev: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = await ev.target.files?.[0]?.arrayBuffer();
    if (file) await handleAB(file);
  }

  return (
    <>
      <Table<User> dataSource={data} />
    </>
  );
};

export default DataTable;
