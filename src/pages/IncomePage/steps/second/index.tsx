import { Button, Form, GetRef, Input, InputNumber, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFile } from "../../../../features/file/fileSelector";
import { ColumnsType } from "antd/es/table";
import { getSplits } from "../../../../features/splits/splitsSelector";
import { WarehousesType } from "../../../../types/types";
import { getTableSplits } from "../../../../features/splitsTable/splitsTableSelector";
import { SplitsTableActions } from "../../../../features/splitsTable/splitsTableSlice";

interface IProps {
  prevStep: () => void;
  nextStep: () => void;
  columns: ColumnsType;
}

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface Item extends WarehousesType<number> {
  barcode: string;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType extends Item {
  key: React.Key;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

export const SecondStep: React.FC<IProps> = ({
  prevStep,
  nextStep,
  columns,
}) => {
  // const [data, setData] = useState([]);
  const data = useSelector(getTableSplits);
  const dispatch = useDispatch();

  const fileData = useSelector(getFile);
  const splitsData = useSelector(getSplits);

  useEffect(() => {
    const array = [];
    for (let index = 0; index < fileData.length; index++) {
      let sum = 0;
      array.push({
        barcode: fileData[index].barcode,
        total: 0,
        status: "Ошибка",
      });
      for (let idx = 0; idx < splitsData.length; idx++) {
        const element = splitsData[idx].name;

        array[index][element] =
          splitsData[idx].divider * Number(fileData[index]["Заказано"]);
        sum += array[index][element];
      }
      array[index].total = Number(fileData[index]["Заказано"]);
      array[index].status = sum === array[index].total ? "Ok" : "Ошибка";
    }

    const filtered = array.filter((e) => e.barcode);
    const keys = Object.keys(filtered[0]);
    const result = filtered.filter((e) => {
      let sum = 0;
      for (let id = 3; id < keys.length; id++) {
        const key = keys[id];
        sum += e[key];
      }
      if (sum > 0) {
        return true;
      } else {
        return false;
      }
    });

    dispatch(
      SplitsTableActions.setSplitsTable(
        result.map((item) => ({ ...item, key: item.barcode }))
      )
    );
  }, []);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row: DataType) => {
    const newData = [...data];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    let sum = 0;
    const excludeKeys = ["barcode", "key", "status", "total"];
    Object.keys(row).forEach((key) => {
      if (!excludeKeys.includes(key)) sum += Number(row[key]);
      // sum += Number(key);
    });
    row.status = sum === item.total ? "Ok" : "Ошибка";

    // for (let idx = 0; idx < splitsData.length; idx++) {
    //   const element = splitsData[idx].name;
    //   sum += item[element];
    // }
    // console.log(sum);

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    dispatch(SplitsTableActions.setSplitsTable(newData));
    // setData(newData);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Table
        columns={
          [
            {
              title: "Статус",
              dataIndex: "status",
              key: "status",
            },
            {
              title: "Всего",
              dataIndex: "total",
              key: "total",
            },
            ...columns,
          ]
            .map((item, index) => {
              if (index > 2) return { ...item, editable: true };
              return item;
            })
            .map((col) => {
              if (!col.editable) {
                return col;
              }
              return {
                ...col,
                onCell: (record: DataType) => ({
                  record,
                  editable: col.editable,
                  dataIndex: col.dataIndex,
                  title: col.title,
                  handleSave,
                }),
              };
            }) as ColumnTypes
        }
        dataSource={data}
        bordered
        components={components}
        rowClassName={() => "editable-row"}
      />
      <Button onClick={prevStep}>Back</Button>
      <Button onClick={nextStep}>Forward</Button>
    </div>
  );
};
