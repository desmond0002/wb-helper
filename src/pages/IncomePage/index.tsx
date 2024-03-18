import {
  Button,
  Card,
  Select,
  Col,
  InputNumber,
  Row,
  Slider,
  Steps,
} from "antd";
import React, { useState } from "react";
import { WAREHOUSES } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { SplitsActions } from "../../features/splits/splitsSlice";
import { SplitType } from "../../types/types";
import { getSplits } from "../../features/splits/splitsSelector";
import { ColumnsType } from "antd/es/table";
import { FirstStep } from "./steps/first";
import { SecondStep } from "./steps/second";
import { ThirdStep } from "./steps/third";

export const IncomePage: React.FC = () => {
  const [columns, setColumns] = useState<ColumnsType>([]);
  const [step, setStep] = useState<number>(1);
  const dispatch = useDispatch();
  const splits = useSelector(getSplits);

  const buildSplits = () => {
    const cols: ColumnsType = [
      {
        key: "barcode",
        title: "Баркод",
        dataIndex: "barcode",
      },
    ];

    splits.forEach((item) => {
      cols.push({
        key: item.name,
        title: "Склад",
        dataIndex: item.name,
      });
    });

    setColumns(cols);
    setStep((prev) => prev + 1);
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  //   useEffect(() => {
  //     console.log(options);
  //   }, [options]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Steps
        current={step}
        items={[
          {
            title: "Выбрать склады",
          },
          {
            title: "Утвердить разбиения",
          },
          {
            title: "Готово",
          },
        ]}
      />
      {step === 1 && <FirstStep nextStep={buildSplits} />}
      {step === 2 && <SecondStep nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <ThirdStep prevStep={prevStep} />}
    </div>
  );
};
