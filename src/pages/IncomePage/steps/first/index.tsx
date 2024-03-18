import { Button, Card, Select, Col, InputNumber, Row, Slider } from "antd";
import React from "react";
import { WAREHOUSES } from "../../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { SplitsActions } from "../../../../features/splits/splitsSlice";
import { SplitType } from "../../../../types/types";
import { getSplits } from "../../../../features/splits/splitsSelector";

interface IProps {
  nextStep: () => void;
}

export const FirstStep: React.FC<IProps> = ({ nextStep }) => {
  const dispatch = useDispatch();
  const splits = useSelector(getSplits);

  const onSelect = (name: string) => {
    dispatch(SplitsActions.addWarehouse(name));
  };

  const onDeselect = (name: string) => {
    dispatch(SplitsActions.deleteWarehouse(name));
  };

  const onChange = (item: SplitType) => {
    if (isNaN(item.divider)) {
      return;
    }
    dispatch(SplitsActions.changeDevider(item));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Выберите склады для поставки"
        options={WAREHOUSES.map((value) => ({
          label: value,
          value: value,
        }))}
        onDeselect={onDeselect}
        onSelect={onSelect}
      />
      {splits?.map((item) => (
        <Card style={{ width: 300 }}>
          <h3>{item.name}</h3>
          <Row>
            <Col span={12}>
              <Slider
                min={0}
                max={1}
                onChange={(e) => onChange({ name: item.name, divider: e })}
                value={typeof item.divider === "number" ? item.divider : 0}
                step={0.01}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={0}
                max={1}
                style={{ margin: "0 16px" }}
                step={0.01}
                value={item.divider}
                onChange={(e) => onChange({ name: item.name, divider: e })}
              />
            </Col>
          </Row>
        </Card>
      ))}
      {splits ? (
        splits.length > 0 && (
          <Button onClick={nextStep}>Построить разбиение</Button>
        )
      ) : (
        <></>
      )}
    </div>
  );
};
